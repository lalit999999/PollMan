import { Outlet, NavLink, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils";
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { path: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
  { path: "/app/polls", icon: ListChecks, label: "My Polls" },
  { path: "/app/polls/new", icon: PlusCircle, label: "Create Poll" },
];

export default function DashboardLayout() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 py-8">
        <img
          src="/content/logo.png"
          alt="POLLMAN"
          className="w-10 h-10 rounded-xl object-cover ring-1 ring-border/60 shadow-sm"
        />
        <div className="leading-tight">
          <span className="block font-semibold text-lg tracking-tight">
            POLLMAN
          </span>
          <span className="block text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Polls & Feedback
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-1">
        <NavLink
          to="/app/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to sign in again
                to access the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground"
              >
                Logout
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center gap-3 rounded-full border border-border bg-muted/30 px-3 py-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/content/logo.png"
                      alt="POLLMAN"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-medium">
                    Welcome back, {user?.name?.split(" ")?.[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
