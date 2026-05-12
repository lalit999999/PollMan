import { Router } from "express";
import {
    handleCreatePoll,
    handleGetPoll,
    handleUpdatePoll,
    handlePublishResults,
    handleSubmitResponse,
    handleGetAnalytics,
} from "../controllers/poll.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { optionalAuthMiddleware } from "../middleware/auth.js";

const router = Router();

// Create poll (protected - authenticated users only)
router.post("/", authMiddleware, handleCreatePoll);

// Get poll (public for viewing, optional auth for checking permissions)
router.get("/:id", optionalAuthMiddleware, handleGetPoll);

// Update poll (protected - only creator)
router.patch("/:id", authMiddleware, handleUpdatePoll);

// Publish results (protected - only creator)
router.post("/:id/publish", authMiddleware, handlePublishResults);

// Submit response (public/optional auth based on poll settings)
router.post("/:id/respond", optionalAuthMiddleware, handleSubmitResponse);

// Get analytics (protected - only creator)
router.get("/:id/analytics", authMiddleware, handleGetAnalytics);

export default router;
