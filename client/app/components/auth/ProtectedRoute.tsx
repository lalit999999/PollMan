/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading spinner while checking auth state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 animate-pulse" />
          <p className="text-slate-400 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
