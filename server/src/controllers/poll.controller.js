import {
    createPoll,
    getPollById,
    updatePoll,
    publishPollResults,
    submitPollResponse,
    getPollAnalytics,
    logPollAccess,
} from "../services/poll.service.js";

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
        const statusCode =
            error.message === "Poll not found" ? 404 : 403;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
}

export async function handleUpdatePoll(req, res) {
    try {
        const { id } = req.params;
        const { title, description, questions } = req.body;

        const poll = await updatePoll(id, req.user._id, {
            title,
            description,
            questions,
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
