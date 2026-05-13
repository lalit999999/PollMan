/**
 * Auth Context
 * Global state management for authentication
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  getStoredUser,
  getStoredTokens,
  setAuthData,
  clearAuthData,
} from "../services/authService";
import { getProfile } from "../services/userService";

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = getStoredUser();
      const storedTokens = getStoredTokens();

      if (storedUser && storedTokens?.accessToken) {
        // optimistic restore from localStorage
        setUser(storedUser);
        setAccessToken(storedTokens.accessToken);

        // fetch fresh profile from API to ensure data is up-to-date
        (async () => {
          try {
            const fresh = await getProfile();
            if (fresh) setUser(fresh);
          } catch (err) {
            console.warn("Failed to fetch fresh profile:", err);
          }
        })();
      }
    } catch (err) {
      console.error("Failed to restore auth state:", err);
      setError("Failed to restore session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    try {
      // persist updated user immediately so UI reads from localStorage don't show stale data
      const storedTokens = getStoredTokens();
      if (storedTokens && storedTokens.accessToken) {
        setAuthData(newUser, storedTokens as any);
      }
    } catch (err) {
      console.warn("Failed to persist auth data:", err);
    }
  }, []);

  // Only update in-memory token here. Persisting to localStorage is
  // handled by the auth service (e.g. on OAuth callback) to avoid
  // cyclical updates and unstable dependencies.
  const handleSetTokens = useCallback(
    (newAccessToken: string, _refreshToken: string) => {
      setAccessToken(newAccessToken);
    },
    [],
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setError(null);
    clearAuthData();
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      isLoading,
      error,
      setUser: handleSetUser,
      setTokens: handleSetTokens,
      logout: handleLogout,
    }),
    [
      user,
      accessToken,
      isLoading,
      error,
      handleSetUser,
      handleSetTokens,
      handleLogout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
