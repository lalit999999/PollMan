/**
 * Auth Success Page
 * Handles OAuth callback redirect
 * Receives: accessToken, refreshToken, user from backend query params
 * Saves to context and localStorage, then redirects to dashboard
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parseAuthSuccess, setAuthData } from "../services/authService";

export function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    try {
      // Parse auth data from URL query params
      const { user, accessToken, refreshToken } =
        parseAuthSuccess(searchParams);

      if (!user || !accessToken) {
        setError("Invalid authentication response. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Save to localStorage
      setAuthData(user, {
        accessToken,
        refreshToken: refreshToken || "",
      });

      // Update auth context
      setUser(user);
      setTokens(accessToken, refreshToken || "");

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate("/app", { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Failed to process auth success:", err);
      setError("An error occurred while completing authentication.");
      setIsProcessing(false);
    }
  }, [searchParams, setUser, setTokens, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="w-full max-w-md mx-auto px-6">
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
            <h1 className="text-xl font-bold text-red-300 mb-2">
              Authentication Error
            </h1>
            <p className="text-sm text-red-200 mb-6">{error}</p>
            <a
              href="/login"
              className="inline-block px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-sm font-medium transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 animate-pulse" />
          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-emerald-500/10 to-amber-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-400 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-slate-200 mb-1">
            Welcome back!
          </h1>
          <p className="text-sm text-slate-400">Completing your login...</p>
        </div>
      </div>
    </div>
  );
}
