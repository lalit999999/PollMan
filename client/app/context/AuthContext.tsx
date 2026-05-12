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

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
  githubId?: string;
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
        setUser(storedUser);
        setAccessToken(storedTokens.accessToken);
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
