import { verifyToken, getTokenFromRequest } from "../services/jwt.service.js";
import { User } from "../models/index.js";

export async function authMiddleware(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const { valid, decoded, error } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error,
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
}

export function optionalAuthMiddleware(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      req.user = null;
      return next();
    }

    const { valid, decoded } = verifyToken(token);

    if (valid) {
      User.findById(decoded.userId).then((user) => {
        req.user = user || null;
        next();
      });
    } else {
      req.user = null;
      next();
    }
  } catch {
    req.user = null;
    next();
  }
}
