import jwt from "jsonwebtoken";
import env from "../config/env.js";

const JWT_EXPIRY = "1d"; // 1 day expiry
const JWT_REFRESH_EXPIRY = "7d"; // 7 days for refresh tokens

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  const refreshToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  });

  return { accessToken, refreshToken };
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
}
