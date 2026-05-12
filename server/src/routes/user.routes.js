import { Router } from "express";
import { getProfile, updateProfile, unlinkProvider } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/user/profile
router.get("/profile", getProfile);

// PATCH /api/user/profile
router.patch("/profile", updateProfile);

// POST /api/user/unlink
router.post("/unlink", unlinkProvider);

export default router;
