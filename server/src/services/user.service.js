import { User } from "../models/index.js";

export async function getUserById(userId) {
    return User.findById(userId).select("-__v");
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

export async function getUserByGithubId(githubId) {
    return User.findOne({ githubId }).select("-__v");
}
