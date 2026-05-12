import { Poll, Question, Response, PollAccessLog } from "../models/index.js";

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
    } = pollData;

    // Create poll
    const poll = new Poll({
        title,
        description,
        createdBy: userId,
        isAnonymous,
        expiresAt,
        allowResultsPublish,
    });

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
                order: index,
            })),
        );

        poll.questions = createdQuestions.map((q) => q._id);
        await poll.save();
    }

    return poll.populate("questions");
}

export async function getPollById(pollId, userId = null) {
    const poll = await Poll.findById(pollId).populate("questions");

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Check if user can view this poll
    const isCreator = userId && poll.createdBy.toString() === userId.toString();
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

    // Can't edit if responses exist
    const responseCount = await Response.countDocuments({ pollId });
    if (responseCount > 0) {
        throw new Error("Cannot edit poll with existing responses");
    }

    // Update poll fields
    if (updateData.title) poll.title = updateData.title;
    if (updateData.description) poll.description = updateData.description;
    if (updateData.questions) {
        // Delete old questions
        await Question.deleteMany({ pollId });

        // Create new questions
        const createdQuestions = await Question.insertMany(
            updateData.questions.map((q, index) => ({
                pollId: poll._id,
                text: q.text,
                type: "single-choice",
                options: (q.options || []).map((opt) => ({
                    text: opt.text || opt,
                    count: 0,
                })),
                isRequired: q.isRequired || false,
                order: index,
            })),
        );

        poll.questions = createdQuestions.map((q) => q._id);
    }

    await poll.save();
    return poll.populate("questions");
}

export async function publishPollResults(pollId, userId) {
    const poll = await Poll.findById(pollId);

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Only creator can publish
    if (poll.createdBy.toString() !== userId.toString()) {
        throw new Error("Not authorized to publish this poll");
    }

    if (!poll.allowResultsPublish) {
        throw new Error("Results publication is disabled for this poll");
    }

    poll.resultsPublished = true;
    await poll.save();

    return poll;
}

export async function submitPollResponse(pollId, responseData, userId = null) {
    const { answers, ipAddress, userAgent } = responseData;

    // Check poll exists and not expired
    const poll = await Poll.findById(pollId).populate("questions");

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Check expiry
    if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
        throw new Error("Poll has expired");
    }

    // Check if user already responded (for authenticated pollees)
    if (userId && !poll.isAnonymous) {
        const existingResponse = await Response.findOne({
            pollId,
            userId,
        });

        if (existingResponse) {
            throw new Error("You have already responded to this poll");
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
        userId: poll.isAnonymous ? null : userId,
        answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption,
        })),
        isAnonymous: poll.isAnonymous,
        ipAddress,
        userAgent,
        completionPercentage,
    });

    await response.save();

    // Update question option counts
    for (const answer of answers) {
        await Question.findByIdAndUpdate(
            answer.questionId,
            {
                $inc: { "options.$[opt].count": 1 },
            },
            {
                arrayFilters: [{ "opt.text": answer.selectedOption }],
            },
        );
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

    return response;
}

export async function getPollAnalytics(pollId, userId) {
    const poll = await Poll.findById(pollId).populate("questions");

    if (!poll) {
        throw new Error("Poll not found");
    }

    // Only creator can view analytics
    if (poll.createdBy.toString() !== userId.toString()) {
        throw new Error("Not authorized to view analytics");
    }

    // Get all responses
    const responses = await Response.find({ pollId }).sort({ createdAt: 1 });

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
        totalResponses: responses.length,
        completionRate,
        completionPercentage: averageCompletion,
        averageCompletion,
        expiresAt: poll.expiresAt,
        resultsPublished: poll.resultsPublished,
        questionAnalytics,
        timeline: buildTimelineBuckets(responses),
        recentResponses: responses
            .slice(-10)
            .reverse()
            .map((r) => ({
                respondedAt: r.createdAt,
                completionPercentage: r.completionPercentage,
                isAnonymous: r.isAnonymous,
            })),
    };
}
