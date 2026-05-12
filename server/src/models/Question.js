import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Poll",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["single-choice"],
            default: "single-choice",
        },
        options: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true,
                },
                text: {
                    type: String,
                    required: true,
                    trim: true,
                },
                count: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        isRequired: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

questionSchema.index({ pollId: 1, order: 1 });
questionSchema.index({ pollId: 1 });

export const Question = mongoose.model("Question", questionSchema);
