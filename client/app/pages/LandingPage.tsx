import { Link, NavLink } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  BarChart3,
  Zap,
  Globe,
  Shield,
  Moon,
  Sun,
  CheckCircle,
  Users,
  TrendingUp,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../lib/socketClient";
import Footer from "../components/ui/Footer";

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Create polls and get responses in seconds with our optimized platform.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      desc: "Watch responses roll in live with beautiful, interactive charts.",
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      desc: "Embed your polls on any website or share directly via a simple link.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Enterprise-grade security ensuring your data remains protected.",
    },
  ];

  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-24 flex flex-col justify-center border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <img
              src="/content/logo.png"
              alt="POLLMAN"
              className="w-10 h-10 rounded-2xl object-cover"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">
                POLLMAN
              </p>
              <h1 className="text-xl font-semibold"></h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Documentation", path: "/documentation" },
              { label: "About", path: "/about" },
              { label: "Terms", path: "/terms" },
              { label: "Privacy", path: "/privacy" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition duration-150 ${
                    isActive
                      ? "text-primary underline underline-offset-4"
                      : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition hover:border-primary"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Log in
                </Link>
                <Button asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-2">
                <img
                  src={user.avatar || "/content/logo.png"}
                  alt={user.name || "avatar"}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="text-sm font-medium">
                  Hi, {user.name?.split(" ")[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                PollForm 2.0 is now live
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Engage your audience with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  beautiful surveys
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Create stunning, interactive polls in seconds. Gather insights,
                analyze data in real-time, and make better decisions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base"
                  asChild
                >
                  <Link to="/login">Create Free Poll</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base glass"
                >
                  View Examples
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-base"
                  asChild
                >
                  <Link to="/app">Open App</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 lg:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Everything you need to gather insights
              </h2>
              <p className="text-muted-foreground text-lg">
                Powerful tools built for modern teams.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full bg-card hover:border-primary/50 transition-colors glass">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How POLLMAN Works</h2>
              <p className="text-muted-foreground text-lg">
                Create, share, and analyze polls in just a few simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your Poll",
                  desc: "Design questions, set options, and configure settings in our intuitive builder.",
                  icon: CheckCircle,
                },
                {
                  step: "02",
                  title: "Share the Link",
                  desc: "Get a unique shareable link or QR code to distribute your poll anywhere.",
                  icon: Users,
                },
                {
                  step: "03",
                  title: "Collect Responses",
                  desc: "Watch responses come in real-time with live analytics and notifications.",
                  icon: TrendingUp,
                },
                {
                  step: "04",
                  title: "Analyze Results",
                  desc: "View detailed analytics, charts, and insights to make data-driven decisions.",
                  icon: BarChart3,
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary text-2xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-24 px-6 lg:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">See POLLMAN in Action</h2>
              <p className="text-muted-foreground text-lg">
                Watch how easy it is to create and manage polls.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6 glass">
                <h3 className="text-xl font-semibold mb-4">
                  Dashboard Preview
                </h3>
                <img
                  src="/content/screenshot-dashboard.png"
                  alt="Dashboard Screenshot"
                  className="w-full rounded-lg border"
                />
              </Card>
              <Card className="p-6 glass">
                <h3 className="text-xl font-semibold mb-4">Analytics View</h3>
                <img
                  src="/content/screenshot-analytics.png"
                  alt="Analytics Screenshot"
                  className="w-full rounded-lg border"
                />
              </Card>
            </div>

            <div className="text-center">
              <Card className="p-6 glass max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Demo Video</h3>
                <video
                  src="/content/demo-video.mp4"
                  controls
                  className="w-full rounded-lg"
                  poster="/content/video-poster.png"
                >
                  Your browser does not support the video tag.
                </video>
              </Card>
            </div>
          </div>
        </section>

        {/* Developer Contact Section */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Meet the Developer</h2>
            <Card className="p-8 glass max-w-md mx-auto">
              <img
                src="/content/developer-avatar.png"
                alt="Developer"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Lalit Kumar</h3>
              <p className="text-muted-foreground mb-4">
                Full-Stack Developer & UI/UX Enthusiast
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/lalit79"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/lalit79"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:lalit@example.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function HeaderRight() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let socket: any = null;
    if (user) {
      socket = connectSocket();

      socket.on("poll:created", (payload: any) => {
        setEvents((prev) =>
          [
            { type: "created", ...payload, receivedAt: new Date() },
            ...prev,
          ].slice(0, 5),
        );
      });

      socket.on("poll:published", (payload: any) => {
        setEvents((prev) =>
          [
            { type: "published", ...payload, receivedAt: new Date() },
            ...prev,
          ].slice(0, 5),
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("poll:created");
        socket.off("poll:published");
        disconnectSocket();
      }
    };
  }, [user]);

  return (
    <div className="relative flex flex-wrap items-center gap-4">
      <nav className="hidden sm:flex items-center gap-3">
        <Link
          to="/documentation"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Documentation
        </Link>
        <Link
          to="/about"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          About
        </Link>
        <Link
          to="/terms"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Terms
        </Link>
        <Link
          to="/privacy"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Privacy
        </Link>
      </nav>

      {/* Theme toggle */}
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-3 py-2 rounded-md border border-border text-sm"
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>

      {!user ? (
        <>
          <Link
            to="/login"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 text-sm font-medium">
            <img
              src={user.avatar || "/content/logo.png"}
              alt={user.name || "avatar"}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
            <span className="hidden sm:inline">
              Welcome, {user.name?.split(" ")?.[0]}
            </span>
          </div>

          <Link
            to="/app/settings"
            className="text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Manage
          </Link>
        </>
      )}

      {/* Live events toast area (visible only when logged in) */}
      {user && events.length > 0 && (
        <div className="absolute right-4 top-14 w-80 bg-card border border-border rounded-lg shadow-lg p-3 space-y-2">
          {events.map((e, idx) => (
            <div key={idx} className="text-sm">
              {e.type === "created" ? (
                <>
                  <strong>New poll:</strong> {e.title}
                </>
              ) : (
                <>
                  <strong>Published:</strong> {e.title}
                </>
              )}
              <div className="text-xs text-muted-foreground">
                {new Date(e.receivedAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
