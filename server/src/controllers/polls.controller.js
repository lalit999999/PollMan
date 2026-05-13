import { Poll, Response, Question } from "../models/index.js";
import { getUserPolls } from "../services/polls.service.js";
import { getDashboardOverview } from "../services/poll.service.js";

export async function handleGetUserPolls(req, res) {
    try {
        const { status, search, sort = "-createdAt", page = 1, limit = 10 } =
            req.query;

        const skip = (page - 1) * limit;

        const result = await getUserPolls(req.user._id, {
            status,
            search,
            sort,
            limit: Number(limit),
            skip: Number(skip),
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch polls",
            error: error.message,
        });
    }
}

export async function handleGetDashboardOverview(req, res) {
    try {
        const overview = await getDashboardOverview(req.user._id);

        return res.status(200).json({
            success: true,
            data: overview,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard overview",
            error: error.message,
        });
    }
}

export async function handleGetPublicResults(req, res) {
    try {
        const { id } = req.params;

        const poll = await Poll.findById(id).populate("questions");

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found",
            });
        }

        // Check if results are published
        if (!poll.resultsPublished) {
            return res.status(403).json({
                success: false,
                message: "Results are not yet published",
            });
        }

        // Check if poll is expired
        const isExpired =
            poll.expiresAt && new Date() > new Date(poll.expiresAt);

        return res.status(200).json({
            success: true,
            data: {
                pollId: poll._id,
                title: poll.title,
                description: poll.description,
                totalResponses: poll.totalResponses,
                isExpired,
                expiresAt: poll.expiresAt,
                questions: poll.questions.map((q) => ({
                    _id: q._id,
                    text: q.text,
                    options: q.options.map((opt) => ({
                        text: opt.text,
                        count: opt.count,
                        percentage:
                            poll.totalResponses > 0
                                ? Math.round(
                                    (opt.count / poll.totalResponses) * 100,
                                )
                                : 0,
                    })),
                })),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch results",
            error: error.message,
        });
    }
}

export async function handleDeletePoll(req, res) {
    try {
        const { id } = req.params;

        const poll = await Poll.findById(id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: "Poll not found",
            });
        }

        // Only creator can delete
        if (poll.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this poll",
            });
        }

        // Delete poll, questions, and responses
        await Poll.findByIdAndDelete(id);
        await Question.deleteMany({ pollId: id });
        await Response.deleteMany({ pollId: id });

        return res.status(200).json({
            success: true,
            message: "Poll deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete poll",
            error: error.message,
        });
    }
}
