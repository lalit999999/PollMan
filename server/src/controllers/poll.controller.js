import {
    createPoll,
    getPollById,
    updatePoll,
    publishPoll,
    publishPollResults,
    submitPollResponse,
    getPollAnalytics,
    logPollAccess,
} from "../services/poll.service.js";
import { Poll } from "../models/index.js";

export async function handleCreatePoll(req, res) {
    try {
        const { title, description, questions, isAnonymous, expiresAt, allowResultsPublish } =
            req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Poll title is required",
            });
        }

        if (!questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one question is required",
            });
        }

        if (!expiresAt) {
            return res.status(400).json({
                success: false,
                message: "Expiry date is required for creating a poll",
            });
        }

        const poll = await createPoll(req.user._id, {
            title,
            description,
            questions,
            isAnonymous,
            expiresAt,
            allowResultsPublish,
        });

        return res.status(201).json({
            success: true,
            message: "Poll created successfully",
            data: poll,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create poll",
            error: error.message,
        });
    }
}

export async function handleGetPoll(req, res) {
    try {
        const { id } = req.params;
        const poll = await getPollById(id, req.user?._id);

        await logPollAccess({
            pollId: id,
            userId: req.user?._id || null,
            action: "view",
            metadata: {
                area: "poll-details",
            },
            ipAddress: req.ip || req.connection.remoteAddress || null,
            userAgent: req.get("user-agent") || null,
        });

        return res.status(200).json({
            success: true,
            data: poll,
        });
    } catch (error) {
        // If poll is not accessible (unpublished) allow a preview when
        // the requester includes ?preview=1 and is the creator (authenticated).
        if (error.message === "Poll not accessible" && req.query?.preview && req.user) {
            try {
                const previewPoll = await Poll.findById(req.params.id).populate("questions");
                if (previewPoll && previewPoll.createdBy.toString() === req.user._id.toString()) {
                    await logPollAccess({
                        pollId: req.params.id,
                        userId: req.user._id,
                        action: "preview",
                        metadata: { area: "poll-preview" },
                        ipAddress: req.ip || req.connection.remoteAddress || null,
                        userAgent: req.get("user-agent") || null,
                    });

                    return res.status(200).json({ success: true, data: previewPoll });
                }
            } catch (innerErr) {
                console.error("Preview fetch failed:", innerErr.message);
            }
        }

        const statusCode = error.message === "Poll not found" ? 404 : 403;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}

export async function handleUpdatePoll(req, res) {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            questions,
            isAnonymous,
            expiresAt,
            allowResultsPublish,
        } = req.body;

        const poll = await updatePoll(id, req.user._id, {
            title,
            description,
            questions,
            isAnonymous,
            expiresAt,
            allowResultsPublish,
        });

        return res.status(200).json({
            success: true,
            message: "Poll updated successfully",
            data: poll,
        });
    } catch (error) {
        const statusCode = error.message === "Poll not found" ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}

export async function handlePublishResults(req, res) {
    try {
        const { id } = req.params;

        const poll = await publishPollResults(id, req.user._id);

        return res.status(200).json({
            success: true,
            message: "Poll results published successfully",
            data: poll,
        });
    } catch (error) {
        const statusCode = error.message === "Poll not found" ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}

export async function handlePublishPoll(req, res) {
    try {
        const { id } = req.params;

        const poll = await publishPoll(id, req.user._id);

        return res.status(200).json({
            success: true,
            message: "Poll published successfully",
            data: poll,
        });
    } catch (error) {
        const statusCode = error.message === "Poll not found" ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}

export async function handleSubmitResponse(req, res) {
    try {
        const { id } = req.params;
        const { answers } = req.body;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one answer is required",
            });
        }

        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get("user-agent") || "";

        const response = await submitPollResponse(
            id,
            { answers, ipAddress, userAgent },
            req.user?._id,
        );

        return res.status(201).json({
            success: true,
            message: "Response submitted successfully",
            data: response,
        });
    } catch (error) {
        const statusCode =
            error.message === "Poll not found" ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}

export async function handleGetAnalytics(req, res) {
    try {
        const { id } = req.params;

        const analytics = await getPollAnalytics(id, req.user._id);

        await logPollAccess({
            pollId: id,
            userId: req.user?._id || null,
            action: "view",
            metadata: {
                area: "analytics",
            },
            ipAddress: req.ip || req.connection.remoteAddress || null,
            userAgent: req.get("user-agent") || null,
        });

        return res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        const statusCode = error.message === "Poll not found" ? 404 : 403;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}
