import { Router } from "express";
import {
    handleCreatePoll,
    handleGetPoll,
    handleUpdatePoll,
    handlePublishPoll,
    handlePublishResults,
    handleSubmitResponse,
    handleGetAnalytics,
    handleVerifyPollPassword,
} from "../controllers/poll.controller.js";
import {
    handleGetUserPolls,
    handleDeletePoll,
    handleGetDashboardOverview,
} from "../controllers/polls.controller.js";
import { handleGetPublicResults } from "../controllers/polls.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { optionalAuthMiddleware } from "../middleware/auth.js";

const router = Router();

// Get current user's polls (protected)
router.get("/", authMiddleware, handleGetUserPolls);

// Dashboard overview (protected)
router.get("/summary", authMiddleware, handleGetDashboardOverview);

// Create poll (protected - authenticated users only)
router.post("/", authMiddleware, handleCreatePoll);

// Get poll (public for viewing, optional auth for checking permissions)
router.get("/:id", optionalAuthMiddleware, handleGetPoll);

// Update poll (protected - only creator)
router.patch("/:id", authMiddleware, handleUpdatePoll);

// Publish poll draft (protected - only creator)
router.post("/:id/go-live", authMiddleware, handlePublishPoll);

// Delete poll (protected - only creator)
router.delete("/:id", authMiddleware, handleDeletePoll);

// Publish results (protected - only creator)
router.post("/:id/publish", authMiddleware, handlePublishResults);

// Public results page
router.get("/:id/results", optionalAuthMiddleware, handleGetPublicResults);

// Submit response (public/optional auth based on poll settings)
router.post("/:id/respond", optionalAuthMiddleware, handleSubmitResponse);

// Verify poll password before allowing responses
router.post("/:id/verify-password", optionalAuthMiddleware, handleVerifyPollPassword);

// Get analytics (protected - only creator)
router.get("/:id/analytics", authMiddleware, handleGetAnalytics);

export default router;
