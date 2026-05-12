import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Outlet />
    </div>
  );
}
