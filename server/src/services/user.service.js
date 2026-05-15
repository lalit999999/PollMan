import { User, Poll, Response } from "../models/index.js";

export async function getUserById(userId) {
    return User.findById(userId).select("-__v");
}

export async function getUserProfileSummary(userId) {
    const user = await User.findById(userId).select("-__v");

    if (!user) {
        return null;
    }

    const createdPolls = await Poll.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .select("-__v");

    const pollIds = createdPolls.map((poll) => poll._id);
    const responseCounts = pollIds.length
        ? await Response.aggregate([
            { $match: { pollId: { $in: pollIds } } },
            { $group: { _id: "$pollId", total: { $sum: 1 } } },
        ])
        : [];

    const responseCountMap = new Map(
        responseCounts.map((row) => [row._id.toString(), row.total]),
    );

    const createdPollsWithCounts = createdPolls.map((poll) => ({
        ...poll.toObject(),
        responseCount: responseCountMap.get(poll._id.toString()) || 0,
    }));

    const totalResponsesReceived = createdPollsWithCounts.reduce(
        (sum, poll) => sum + (poll.responseCount || 0),
        0,
    );

    const topPolls = [...createdPollsWithCounts]
        .sort((a, b) => (b.responseCount || 0) - (a.responseCount || 0))
        .slice(0, 3);

    return {
        user,
        totalResponsesReceived,
        createdPolls: createdPollsWithCounts,
        topPolls,
    };
}

export async function updateUserProfile(userId, updateData) {
    const allowedFields = ["name", "avatar"];
    const updates = {};

    allowedFields.forEach((field) => {
        if (updateData[field]) {
            updates[field] = updateData[field];
        }
    });

    return User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
    }).select("-__v");
}

export async function getUserByEmail(email) {
    return User.findOne({ email }).select("-__v");
}

export async function getUserByGoogleId(googleId) {
    return User.findOne({ googleId }).select("-__v");
}

export async function unlinkProvider(userId, provider) {
    const updates = {};
    if (provider === "google") updates.googleId = null;

    return User.findByIdAndUpdate(userId, updates, { new: true }).select("-__v");
}
