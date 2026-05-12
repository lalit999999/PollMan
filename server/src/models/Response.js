import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
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
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: true,
                },
                selectedOption: {
                    type: String,
                    required: true,
                },
            },
        ],
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        ipAddress: {
            type: String,
            default: null,
        },
        userAgent: {
            type: String,
            default: null,
        },
        completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true },
);

responseSchema.index({ pollId: 1 });
responseSchema.index({ userId: 1, pollId: 1 });
responseSchema.index({ createdAt: -1 });
responseSchema.index({ pollId: 1, createdAt: -1 });

export const Response = mongoose.model("Response", responseSchema);
