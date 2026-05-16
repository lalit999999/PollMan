import { Poll, Question, Response, PollAccessLog } from "../models/index.js";
import bcrypt from "bcryptjs";
import {
    emitPollAnalyticsUpdate,
    emitPollResponseNew,
    emitPollCreated,
    emitPollPublished,
} from "../socket/index.js";

function getEntityId(value) {
    if (!value) return null;

    if (typeof value === "string") return value;

    if (typeof value === "object" && value._id) {
        return value._id.toString();
    }

    return typeof value.toString === "function" ? value.toString() : null;
}

export async function logPollAccess({
    pollId,
    userId = null,
    action,
    metadata = {},
    ipAddress = null,
    userAgent = null,
}) {
    try {
        return await PollAccessLog.create({
            pollId,
            userId,
            action,
            metadata,
            ipAddress,
            userAgent,
        });
    } catch (error) {
        console.error("Failed to write poll access log:", error.message);
        return null;
    }
}

function formatHourBucket(date) {
    const bucketDate = new Date(date);
    bucketDate.setUTCMinutes(0, 0, 0);
    return bucketDate.toISOString();
}

function formatDayBucket(date) {
    return new Date(date).toISOString().slice(0, 10);
}

function buildTimelineBuckets(responses) {
    const hourly = new Map();
    const daily = new Map();

    for (const response of responses) {
        const createdAt = response.createdAt || new Date();
        const hourBucket = formatHourBucket(createdAt);
        const dayBucket = formatDayBucket(createdAt);

        hourly.set(hourBucket, (hourly.get(hourBucket) || 0) + 1);
        daily.set(dayBucket, (daily.get(dayBucket) || 0) + 1);
    }

    return {
        hourly: Array.from(hourly.entries()).map(([bucket, count]) => ({
            bucket,
            count,
        })),
        daily: Array.from(daily.entries()).map(([bucket, count]) => ({
            bucket,
            count,
        })),
    };
}

export async function createPoll(userId, pollData) {
    const {
        title,
        description = "",
        questions = [],
        isAnonymous = false,
        expiresAt = null,
        allowResultsPublish = true,
        passwordProtected = false,
        password = null,
        isResponseLimited = false,
        responseLimit = null,
    } = pollData;

    // Create poll
    const poll = new Poll({
        title,
        description,
        createdBy: userId,
        isAnonymous,
        expiresAt,
        allowResultsPublish,
        passwordProtected,
        isResponseLimited,
        responseLimit: isResponseLimited ? responseLimit : null,
    });

    // If password protection is enabled and a password provided, hash it
    if (passwordProtected && password) {
        try {
            poll.passwordHash = bcrypt.hashSync(String(password).toUpperCase(), 10);
        } catch (err) {
            console.warn("Failed to hash poll password:", err?.message || err);
        }
    }

    await poll.save();

    // Create questions
    if (questions.length > 0) {
        const createdQuestions = await Question.insertMany(
            questions.map((q, index) => ({
                pollId: poll._id,
                text: q.text,
                type: "single-choice",
                options: (q.options || []).map((opt) => ({
                    text: opt.text || opt,
                    count: 0,
                })),
                isRequired: q.isRequired || false,
                allowOpinionText: q.allowOpinionText || false,
                order: index,
            })),
        );

        poll.questions = createdQuestions.map((q) => q._id);
        await poll.save();
    }

    // Emit a global event that a new poll was created so landing pages / public viewers can react
    try {
        emitPollCreated({
            pollId: poll._id,
            title: poll.title,
            createdBy: userId,
            createdAt: poll.createdAt,
            isPublished: poll.isPublished || false,
        });
    } catch (err) {
        console.warn("Failed to emit poll created event:", err?.message || err);
    }

    return poll.populate("questions");
}

export async function getPollById(pollId, userId = null) {
    const poll = await Poll.findById(pollId).populate("questions").populate("createdBy", "name email");

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Check if user can view this poll
    const creatorId = getEntityId(poll.createdBy);
    const isCreator = userId && creatorId === userId.toString();
    const isPublished = poll.isPublished;

    if (!isCreator && !isPublished) {
        throw new Error("Poll not accessible");
    }

    // Get response counts for this poll
    const responseCount = await Response.countDocuments({ pollId });
    poll.totalResponses = responseCount;

    return poll;
}

export async function updatePoll(pollId, userId, updateData) {
    const poll = await Poll.findById(pollId);

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Only creator can edit
    if (poll.createdBy.toString() !== userId.toString()) {
        throw new Error("Not authorized to edit this poll");
    }

    // Update poll fields
    if (updateData.title !== undefined) poll.title = updateData.title;
    if (updateData.description !== undefined) poll.description = updateData.description;
    if (typeof updateData.isAnonymous === "boolean") {
        poll.isAnonymous = updateData.isAnonymous;
    }
    if (typeof updateData.allowResultsPublish === "boolean") {
        poll.allowResultsPublish = updateData.allowResultsPublish;
    }
    // Handle password protection updates
    if (typeof updateData.passwordProtected === "boolean") {
        poll.passwordProtected = updateData.passwordProtected;

        if (poll.passwordProtected) {
            if (updateData.password) {
                try {
                    poll.passwordHash = bcrypt.hashSync(String(updateData.password).toUpperCase(), 10);
                } catch (err) {
                    console.warn("Failed to hash updated poll password:", err?.message || err);
                }
            }
            // If enabling protection but no password provided, keep existing hash
        } else {
            // If disabling protection, clear stored hash
            poll.passwordHash = null;
        }
    }
    // Handle response limit updates
    if (typeof updateData.isResponseLimited === "boolean") {
        poll.isResponseLimited = updateData.isResponseLimited;
        poll.responseLimit = updateData.isResponseLimited ? Number(updateData.responseLimit) || null : null;
    }
    if (updateData.expiresAt !== undefined) {
        poll.expiresAt = updateData.expiresAt;
    }
    if (Array.isArray(updateData.questions)) {
        const existingQuestions = await Question.find({ pollId }).sort({ order: 1 });
        const nextQuestionIds = [];

        for (const [index, q] of updateData.questions.entries()) {
            const existingQuestion = existingQuestions[index] || null;
            const normalizedOptions = (q.options || []).map((opt, optionIndex) => ({
                _id: existingQuestion?.options?.[optionIndex]?._id,
                text: opt.text || opt,
                count: existingQuestion?.options?.[optionIndex]?.count || 0,
            }));

            if (existingQuestion) {
                existingQuestion.text = q.text;
                existingQuestion.type = "single-choice";
                existingQuestion.options = normalizedOptions;
                existingQuestion.isRequired = q.isRequired || false;
                existingQuestion.allowOpinionText = q.allowOpinionText || false;
                existingQuestion.order = index;
                if (typeof existingQuestion.voteCount !== "number") {
                    existingQuestion.voteCount = 0;
                }
                await existingQuestion.save();
                nextQuestionIds.push(existingQuestion._id);
            } else {
                const createdQuestion = await Question.create({
                    pollId: poll._id,
                    text: q.text,
                    type: "single-choice",
                    options: normalizedOptions.map((opt) => ({
                        text: opt.text,
                        count: opt.count,
                    })),
                    isRequired: q.isRequired || false,
                    allowOpinionText: q.allowOpinionText || false,
                    voteCount: 0,
                    order: index,
                });
                nextQuestionIds.push(createdQuestion._id);
            }
        }

        // Remove extra questions if the poll was shortened
        if (existingQuestions.length > updateData.questions.length) {
            const idsToDelete = existingQuestions
                .slice(updateData.questions.length)
                .map((question) => question._id);
            await Question.deleteMany({ _id: { $in: idsToDelete } });
        }

        poll.questions = nextQuestionIds;
    }

    await poll.save();
    return poll.populate("questions");
}

export async function verifyPollPassword(pollId, password) {
    const poll = await Poll.findById(pollId).select('+passwordHash');

    if (!poll) throw new Error('Poll not found');

    if (!poll.passwordProtected) return true;

    if (!password) return false;

    try {
        return bcrypt.compareSync(String(password).toUpperCase(), poll.passwordHash || "");
    } catch (err) {
        console.warn('Password verification failed:', err?.message || err);
        return false;
    }
}

export async function publishPollResults(pollId, userId) {
    const poll = await Poll.findById(pollId);

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Only creator can publish
    if (getEntityId(poll.createdBy) !== userId.toString()) {
        throw new Error("Not authorized to publish this poll");
    }

    if (!poll.allowResultsPublish) {
        throw new Error("Results publication is disabled for this poll");
    }

    poll.resultsPublished = true;
    await poll.save();

    return poll;
}

export async function publishPoll(pollId, userId) {
    const poll = await Poll.findById(pollId);

    if (!poll) {
        throw new Error("Poll not found");
    }

    if (getEntityId(poll.createdBy) !== userId.toString()) {
        throw new Error("Not authorized to publish this poll");
    }

    poll.isPublished = true;
    poll.status = "active";
    await poll.save();

    // Emit published event so frontpage and subscribers can react
    try {
        emitPollPublished({
            pollId: poll._id,
            title: poll.title,
            createdBy: userId,
            publishedAt: new Date(),
        });
    } catch (err) {
        console.warn("Failed to emit poll published event:", err?.message || err);
    }

    await logPollAccess({
        pollId,
        userId,
        action: "publish",
        metadata: { area: "poll-live" },
    });

    return poll.populate("questions");
}

export async function submitPollResponse(pollId, responseData, userId = null) {
    const { answers, ipAddress, userAgent } = responseData;

    // Check poll exists and not expired
    const poll = await Poll.findById(pollId).populate("questions");

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Check if user is the creator of the poll
    if (userId && getEntityId(poll.createdBy) === userId.toString()) {
        throw new Error("Poll creators cannot answer their own polls");
    }

    // Check expiry
    if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
        throw new Error("Poll has expired");
    }

    // Check response limit
    if (poll.isResponseLimited && poll.responseLimit && poll.totalResponses >= poll.responseLimit) {
        throw new Error("Response limit has been reached for this poll");
    }

    // Check if user already responded
    if (userId) {
        // Authenticated users: check by userId
        const existingResponse = await Response.findOne({
            pollId,
            userId,
        });

        if (existingResponse) {
            throw new Error("You have already responded to this poll. Only one response allowed per user.");
        }
    } else if (poll.isAnonymous && ipAddress) {
        // Anonymous users: check by IP address
        const existingResponse = await Response.findOne({
            pollId,
            ipAddress,
            isAnonymous: true,
        });

        if (existingResponse) {
            throw new Error("You have already responded to this poll. Only one response allowed per device.");
        }
    }

    // Validate all required questions are answered
    const requiredQuestions = poll.questions.filter((q) => q.isRequired);
    const answeredQuestionIds = answers.map((a) => a.questionId.toString());

    for (const requiredQ of requiredQuestions) {
        if (!answeredQuestionIds.includes(requiredQ._id.toString())) {
            throw new Error(
                `Question "${requiredQ.text}" is required`,
            );
        }
    }

    // Calculate completion percentage
    const completionPercentage = Math.round(
        (answers.length / poll.questions.length) * 100,
    );

    // Create response
    const response = new Response({
        pollId,
        userId: userId || null,  // Always capture userId if logged in, regardless of poll anonymous setting
        answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption,
            opinion: a.opinion?.trim() || "",
        })),
        isAnonymous: poll.isAnonymous,
        ipAddress,
        userAgent,
        completionPercentage,
    });

    await response.save();

    // Update question option counts
    for (const answer of answers) {
        if (answer.selectedOption) {
            // For questions with options, update both voteCount and option count
            await Question.findByIdAndUpdate(answer.questionId, {
                $inc: {
                    voteCount: 1,
                    "options.$[opt].count": 1,
                },
            }, {
                arrayFilters: [{ "opt.text": answer.selectedOption }],
            });
        } else {
            // For opinion-only questions with no selected option, just increment voteCount
            await Question.findByIdAndUpdate(answer.questionId, {
                $inc: {
                    voteCount: 1,
                },
            });
        }
    }

    // Update poll total responses
    poll.totalResponses += 1;
    await poll.save();

    await logPollAccess({
        pollId,
        userId: poll.isAnonymous ? null : userId,
        action: "respond",
        metadata: {
            responseId: response._id,
            answerCount: answers.length,
            completionPercentage,
            answers: response.answers,
        },
        ipAddress,
        userAgent,
    });

    emitPollResponseNew(pollId, {
        pollId,
        responseId: response._id,
        userId: response.userId,
        isAnonymous: response.isAnonymous,
        completionPercentage: response.completionPercentage,
        createdAt: response.createdAt,
    });

    const liveAnalytics = await getPollAnalytics(pollId, poll.createdBy);
    emitPollAnalyticsUpdate(poll.createdBy.toString(), {
        pollId,
        totalResponses: liveAnalytics.totalResponses,
        completionRate: liveAnalytics.completionRate,
        completionPercentage: liveAnalytics.completionPercentage,
        averageCompletion: liveAnalytics.averageCompletion,
        questionAnalytics: liveAnalytics.questionAnalytics,
        timeline: liveAnalytics.timeline,
        recentResponses: liveAnalytics.recentResponses,
        updatedAt: new Date(),
    });

    return response;
}

export async function getPollAnalytics(pollId, userId) {
    const poll = await Poll.findById(pollId).populate("questions");

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Only creator can view analytics
    if (getEntityId(poll.createdBy) !== userId.toString()) {
        throw new Error("Not authorized to view analytics");
    }

    // Get all responses (populate user info when available)
    const responses = await Response.find({ pollId })
        .sort({ createdAt: 1 })
        .populate("userId", "name email avatar");

    const responseItems = responses.map((r) => ({
        responseId: r._id,
        respondedAt: r.createdAt,
        completionPercentage: r.completionPercentage,
        isAnonymous: r.isAnonymous,
        userName: r.userId?.name || null,
        userEmail: r.userId?.email || null,
        userAvatar: r.userId?.avatar || null,
        ipAddress: r.ipAddress || null,
        responder: r.userId
            ? (r.userId.name && r.userId.name.trim())
                ? r.userId.name
                : (r.userId.email ? r.userId.email.split("@")[0] : r.userId._id.toString())
            : r.ipAddress || "unknown",
        responderId: r.userId ? r.userId._id : null,
        answers: r.answers,
    }));

    // Build analytics
    const questionAnalytics = poll.questions.map((question) => {
        const questionResponses = responses.filter((r) =>
            r.answers.some((a) => a.questionId.toString() === question._id.toString()),
        );

        const optionCounts = new Map(
            question.options.map((option) => [option.text, 0]),
        );

        for (const response of questionResponses) {
            const answer = response.answers.find(
                (a) => a.questionId.toString() === question._id.toString(),
            );

            if (answer && optionCounts.has(answer.selectedOption)) {
                optionCounts.set(
                    answer.selectedOption,
                    optionCounts.get(answer.selectedOption) + 1,
                );
            }
        }

        return {
            questionId: question._id,
            text: question.text,
            isRequired: question.isRequired,
            voteCount: question.voteCount || questionResponses.length,
            totalResponses: questionResponses.length,
            options: question.options.map((opt) => ({
                text: opt.text,
                count: optionCounts.get(opt.text) || 0,
                percentage: questionResponses.length > 0
                    ? Math.round(
                        ((optionCounts.get(opt.text) || 0) /
                            questionResponses.length) * 100,
                    )
                    : 0,
            })),
        };
    });

    const completionRate = responses.length > 0
        ? Math.round(
            (responses.filter((r) => r.completionPercentage === 100).length /
                responses.length) *
            100,
        )
        : 0;

    const averageCompletion = responses.length > 0
        ? Math.round(
            responses.reduce((sum, r) => sum + r.completionPercentage, 0) /
            responses.length,
        )
        : 0;

    return {
        pollId,
        title: poll.title,
        isResponseLimited: poll.isResponseLimited || false,
        responseLimit: poll.responseLimit ?? null,
        responseLimitReached:
            !!(poll.isResponseLimited && poll.responseLimit && responses.length >= poll.responseLimit),
        totalResponses: responses.length,
        completionRate,
        completionPercentage: averageCompletion,
        averageCompletion,
        expiresAt: poll.expiresAt,
        resultsPublished: poll.resultsPublished,
        questionAnalytics,
        timeline: buildTimelineBuckets(responses),
        allResponses: responseItems,
        recentResponses: responseItems.slice(-10).reverse(),
    };
}

export async function getDashboardOverview(userId) {
    const polls = await Poll.find({ createdBy: userId });

    // Get response counts per poll
    const responseCounts = await Response.aggregate([
        { $match: { pollId: { $in: polls.map((p) => p._id) } } },
        { $group: { _id: "$pollId", total: { $count: {} } } },
    ]);

    const responseCountMap = new Map(
        responseCounts.map((row) => [row._id.toString(), row.total]),
    );

    const totalResponses = responseCounts.reduce((sum, row) => sum + row.total, 0);
    const activePolls = polls.filter(
        (poll) =>
            poll.isPublished &&
            (!poll.expiresAt || new Date(poll.expiresAt) > new Date()),
    ).length;

    // Get 7-day activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentLogs = await PollAccessLog.find({
        userId,
        createdAt: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
    });

    const dailySeries = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(today);
        day.setDate(today.getDate() - (6 - index));
        const key = day.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
        return { key, count: 0 };
    });

    for (const log of recentLogs) {
        const dayKey = new Date(log.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
        const entry = dailySeries.find((row) => row.key === dayKey);
        if (entry) entry.count += 1;
    }

    return {
        stats: {
            totalPolls: polls.length,
            totalResponses,
            activePolls,
            draftPolls: polls.filter((poll) => !poll.isPublished).length,
        },
        activityTimeline: dailySeries.map((row) => ({
            name: row.key,
            responses: row.count,
        })),
        recentPolls: polls.slice(0, 5).map((poll) => ({
            _id: poll._id,
            title: poll.title,
            description: poll.description,
            createdAt: poll.createdAt,
            isPublished: poll.isPublished,
            resultsPublished: poll.resultsPublished,
            expiresAt: poll.expiresAt,
            status: poll.status,
            totalResponses: responseCountMap.get(poll._id.toString()) || 0,
        })),
        recentActivity: recentLogs.slice(0, 10).map((log) => ({
            _id: log._id,
            action: log.action,
            metadata: log.metadata || {},
            createdAt: log.createdAt,
            pollId: log.pollId,
            userId: log.userId,
        })),
    };
}
