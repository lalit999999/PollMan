import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { BarChart3, Zap, Globe, Shield } from "lucide-react";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-20 flex items-center justify-between px-6 lg:px-12 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="/content/logo.png"
            alt="POLLMAN"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-semibold text-lg tracking-tight">POLLMAN</span>
        </div>
        <HeaderRight />
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
      </main>

      <footer className="border-t border-border py-12 px-6 lg:px-12 bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src="/content/logo.png"
              alt="POLLMAN"
              className="w-6 h-6 rounded object-cover"
            />
            <span className="font-semibold">POLLMAN</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 POLLMAN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeaderRight() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
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
        <Link
          to="/app/settings"
          className="flex items-center gap-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <img
            src={user.avatar || "/content/logo.png"}
            alt={user.name || "avatar"}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <span className="hidden sm:inline">{user.name?.split(" ")?.[0]}</span>
        </Link>
      )}
    </div>
  );
}
