import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      <Outlet />
    </div>
  );
}
