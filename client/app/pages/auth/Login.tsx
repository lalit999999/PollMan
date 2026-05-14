import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import {} from /*Github*/ "lucide-react";
import { AUTH_BASE_URL } from "../../services/runtimeConfig";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_BASE_URL}/google`;
  };

  // GitHub login removed

  return (
    <div className="w-full max-w-[900px] flex rounded-2xl overflow-hidden border border-border shadow-2xl glass min-h-[500px]">
      {/* Branding Panel */}
      <div className="hidden md:flex md:w-1/2 bg-muted p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <img
            src="https://res.cloudinary.com/dsmyka9cr/image/upload/v1778721396/logo_wsb8xy.png"
            alt="POLLMAN"
            className="w-56 h-56 rounded-[8rem] object-cover shadow-2xl ring-1 ring-white/10"
          />
          <div className="space-y-4 max-w-sm">
            <h2 className="text-3xl font-bold">
              Start gathering insights today.
            </h2>
            <p className="text-muted-foreground">
              Join thousands of teams using POLLMAN to make data-driven
              decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card">
        <div className="max-w-sm w-full mx-auto space-y-8">
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 relative"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            {/* GitHub login removed */}
          </div>

          <p className="text-center text-sm text-muted-foreground pt-4">
            By clicking continue, you agree to our <br />
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
