import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            default: "",
        },
        googleId: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export const User = mongoose.model("User", userSchema);
