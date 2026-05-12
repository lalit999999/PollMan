import { Router } from "express";
import passport from "passport";
import {
  googleAuth,
  googleAuthCallback,
  githubAuth,
  githubAuthCallback,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  googleAuthCallback,
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  githubAuthCallback,
);

// Logout
router.post("/logout", logout);

// Get current user
router.get("/me", authMiddleware, getMe);

export default router;
