import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { StaticPageShell } from "../components/ui/StaticPageShell";

export default function Documentation() {
  return (
    <StaticPageShell
      title="Documentation"
      subtitle="Learn how to use POLLMAN effectively"
    >
      <div className="space-y-10">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Documentation
            </p>
            <h1 className="text-4xl font-bold tracking-tight">POLLMAN docs</h1>
            <p className="text-muted-foreground max-w-3xl">
              This section explains how the poll platform works, how to create
              and publish polls, and how responses flow through the app.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Use the landing page to sign in with Google and open the
                  dashboard. From there, create new polls, add questions, and
                  share the poll link.
                </p>
                <p>
                  Each poll supports single-choice questions, optional/required
                  settings, anonymous response mode, expiry scheduling, and
                  publish controls for public results.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Real-time updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The app uses Socket.IO to emit live events for new polls, poll
                  publishing, and response activity. Logged-in users can see
                  updates immediately without refreshing.
                </p>
                <p>
                  The dashboard receives analytics updates as responses arrive,
                  and public pages reflect published poll state as soon as it
                  changes.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Key workflows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li>
                  <strong>Create poll:</strong> Add title, description,
                  questions, and publish settings on the dashboard.
                </li>
                <li>
                  <strong>Share link:</strong> Use the public poll URL to
                  collect responses until the expiry date.
                </li>
                <li>
                  <strong>Publish results:</strong> Reveal final analytics to
                  anyone visiting the public results page.
                </li>
                <li>
                  <strong>Analytics:</strong> View response totals, question
                  counts, and live activity in the dashboard.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass p-6">
            <h2 className="text-xl font-semibold mb-3">Need help?</h2>
            <p className="text-sm text-muted-foreground">
              Visit the About page to learn more about POLLMAN’s mission and
              feature goals.
            </p>
            <Button asChild className="mt-4">
              <Link to="/about">About POLLMAN</Link>
            </Button>
          </Card>
          <Card className="glass p-6">
            <h2 className="text-xl font-semibold mb-3">Terms & Privacy</h2>
            <p className="text-sm text-muted-foreground">
              Review the app terms and privacy policy to understand usage and
              data handling.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Button asChild variant="outline">
                <Link to="/terms">Terms of Service</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </StaticPageShell>
  );
}
