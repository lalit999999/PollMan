/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */

import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../ui/Loader";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <Loader className="scale-125" label="Checking authentication" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
