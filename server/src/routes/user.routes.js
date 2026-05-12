import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/user/profile
router.get("/profile", getProfile);

// PATCH /api/user/profile
router.patch("/profile", updateProfile);

export default router;
