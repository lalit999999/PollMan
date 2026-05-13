import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";
import { Button } from "./button";

interface StaticPageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function StaticPageShell({
  title,
  subtitle,
  children,
}: StaticPageShellProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              {subtitle ? (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-muted-foreground">
              Welcome{user ? `, ${user.name?.split(" ")[0]}` : ""}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
