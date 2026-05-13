/**
 * Auth Service
 * Handles token and user data persistence & retrieval
 */

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const AUTH_STORAGE_KEY = "pollman_auth";

/**
 * Parse auth tokens and user from URL query params (after OAuth callback)
 */
export function parseAuthSuccess(queryParams: URLSearchParams): AuthResponse {
  const accessToken = queryParams.get("accessToken");
  const refreshToken = queryParams.get("refreshToken");
  const userStr = queryParams.get("user");

  if (!accessToken) {
    return { user: null, accessToken: null, refreshToken: null };
  }

  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(decodeURIComponent(userStr));
    } catch (err) {
      console.error("Failed to parse user from query params:", err);
    }
  }

  return { user, accessToken, refreshToken: refreshToken || null };
}

/**
 * Get stored tokens from localStorage
 */
export function getStoredTokens(): AuthTokens | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const { accessToken, refreshToken } = JSON.parse(stored);
    if (accessToken) {
      return { accessToken, refreshToken };
    }
  } catch (err) {
    console.error("Failed to parse stored tokens:", err);
  }

  return null;
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): User | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const { user } = JSON.parse(stored);
    return user || null;
  } catch (err) {
    console.error("Failed to parse stored user:", err);
  }

  return null;
}

/**
 * Save tokens and user to localStorage
 */
export function setAuthData(user: User | null, tokens: AuthTokens): void {
  const authData = {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Check if stored token is still valid (basic check, doesn't verify with backend)
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));

    // Check expiry
    if (payload.exp) {
      const expiryMs = payload.exp * 1000;
      return expiryMs > Date.now();
    }

    return true;
  } catch (err) {
    console.error("Failed to validate token:", err);
    return false;
  }
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  const tokens = getStoredTokens();
  return tokens?.accessToken || null;
}
