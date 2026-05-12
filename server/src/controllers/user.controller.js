import {
    getUserById,
    updateUserProfile,
} from "../services/user.service.js";

export async function getProfile(req, res) {
    try {
        const user = await getUserById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
}

export async function updateProfile(req, res) {
    try {
        const { name, avatar } = req.body;

        const updatedUser = await updateUserProfile(req.user._id, {
            name,
            avatar,
        });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
}

export async function unlinkProvider(req, res) {
    try {
        const { provider } = req.body;

        if (!provider || !["google", "github"].includes(provider)) {
            return res.status(400).json({ success: false, message: "Invalid provider" });
        }

        const updated = await updateUserProfile(req.user._id, {
            ...(provider === "google" ? { googleId: null } : {}),
            ...(provider === "github" ? { githubId: null } : {}),
        });

        return res.status(200).json({ success: true, message: `${provider} disconnected`, data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to unlink provider", error: error.message });
    }
}
