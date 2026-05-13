import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { StaticPageShell } from "../components/ui/StaticPageShell";

export default function AboutPage() {
  return (
    <StaticPageShell
      title="About POLLMAN"
      subtitle="Build better polls with a premium interface"
    >
      <div className="space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            About
          </p>
          <h1 className="text-4xl font-bold tracking-tight">About POLLMAN</h1>
          <p className="text-muted-foreground max-w-3xl">
            POLLMAN is a modern poll and survey platform designed to help teams
            collect feedback fast, analyze response trends, and publish results
            with confidence.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Our vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We build premium, easy-to-use poll experiences with clean
                analytics, real-time updates, and beautiful UI for both creators
                and respondents.
              </p>
              <p>
                The goal is to make data collection simple without sacrificing
                clarity, accessibility, or modern design.
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Why POLLMAN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Fast poll creation with reusable question builder UI</li>
                <li>Live analytics and response tracking</li>
                <li>Public results publishing and expiry controls</li>
                <li>Beautiful light/dark mode dashboard experience</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Built for modern teams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Whether you're collecting feedback for a product launch, running a
              quick team pulse check, or sharing public survey results, POLLMAN
              gives you the tools you need to act on data.
            </p>
            <Button asChild>
              <Link to="/documentation">Read the documentation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </StaticPageShell>
  );
}
