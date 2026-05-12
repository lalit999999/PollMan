import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        resultsPublished: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["active", "expired", "archived"],
            default: "active",
        },
        allowResultsPublish: {
            type: Boolean,
            default: true,
        },
        totalResponses: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

pollSchema.index({ createdBy: 1 });
pollSchema.index({ pollId: 1 });
pollSchema.index({ expiresAt: 1 });
pollSchema.index({ isPublished: 1 });
pollSchema.index({ status: 1 });
pollSchema.index({ createdAt: -1 });

export const Poll = mongoose.model("Poll", pollSchema);
