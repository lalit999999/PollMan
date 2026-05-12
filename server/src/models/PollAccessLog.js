import mongoose from "mongoose";

const pollAccessLogSchema = new mongoose.Schema(
    {
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Poll",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        action: {
            type: String,
            enum: ["view", "respond", "publish", "edit", "share"],
            required: true,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

pollAccessLogSchema.index({ pollId: 1 });
pollAccessLogSchema.index({ userId: 1 });
pollAccessLogSchema.index({ pollId: 1, createdAt: -1 });
pollAccessLogSchema.index({ createdAt: -1 });

// TTL index: auto-delete logs after 90 days
pollAccessLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const PollAccessLog = mongoose.model("PollAccessLog", pollAccessLogSchema);
