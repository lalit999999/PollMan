import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { StaticPageShell } from "../components/ui/StaticPageShell";
import Footer from "../components/ui/Footer";
import { Github, Linkedin, Mail, Users, Target, Lightbulb } from "lucide-react";

export default function Documentation() {
  return (
    <>
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
              <h1 className="text-4xl font-bold tracking-tight">
                POLLMAN docs
              </h1>
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
                    Each poll supports single-choice questions,
                    optional/required settings, anonymous response mode, expiry
                    scheduling, and publish controls for public results.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Real-time updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The app uses Socket.IO to emit live events for new polls,
                    poll publishing, and response activity. Logged-in users can
                    see updates immediately without refreshing.
                  </p>
                  <p>
                    The dashboard receives analytics updates as responses
                    arrive, and public pages reflect published poll state as
                    soon as it changes.
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

          {/* Demo Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">See POLLMAN in Action</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Dashboard Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src="/content/screenshot-dashboard.png"
                    alt="Dashboard Screenshot"
                    className="w-full rounded-lg border"
                  />
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src="/content/screenshot-analytics.png"
                    alt="Analytics Screenshot"
                    className="w-full rounded-lg border"
                  />
                </CardContent>
              </Card>
            </div>
            <Card className="glass">
              <CardHeader>
                <CardTitle>Demo Video</CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  src="/content/demo-video.mp4"
                  controls
                  className="w-full rounded-lg"
                  poster="/content/video-poster.png"
                >
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">How POLLMAN Works</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Step-by-Step Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Create Your Poll</h4>
                        <p className="text-sm text-muted-foreground">
                          Design questions with multiple options, set
                          required/optional, and configure expiry.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Share the Link</h4>
                        <p className="text-sm text-muted-foreground">
                          Get a unique URL or QR code to distribute your poll
                          anywhere.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Collect Responses</h4>
                        <p className="text-sm text-muted-foreground">
                          Responses come in real-time with live analytics
                          updates.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Analyze Results</h4>
                        <p className="text-sm text-muted-foreground">
                          View detailed charts, response counts, and publish
                          final results.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Problems POLLMAN Solves</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Manual Feedback Collection:</strong> Automate
                        gathering responses from large groups without manual
                        tracking.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Delayed Analytics:</strong> Get real-time
                        insights instead of waiting for responses to analyze
                        later.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Complex Survey Tools:</strong> Simple, focused
                        interface for quick polls without overwhelming features.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Data Privacy Concerns:</strong> Secure,
                        anonymous options with clear privacy controls.
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Target Users */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Who Uses POLLMAN?</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Businesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gather customer feedback, conduct employee surveys, and make
                    data-driven decisions for product development and team
                    engagement.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Educators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create quick classroom polls, gather student opinions, and
                    assess understanding in real-time during lessons.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Event Organizers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Collect feedback from attendees, gauge interest in sessions,
                    and improve future events with actionable insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Developer Contact */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Meet the Developer</h2>
            <Card className="glass max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <img
                  src="/content/developer-avatar.png"
                  alt="Developer"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-2">Lalit Kumar</h3>
                <p className="text-muted-foreground mb-4">
                  Full-Stack Developer
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://github.com/lalit79/pollman"
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
              </CardContent>
            </Card>
          </div>

          {/* GitHub Repo */}
          <div className="text-center">
            <Card className="glass max-w-lg mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Open Source Project
                </h3>
                <p className="text-muted-foreground mb-4">
                  POLLMAN is open source! Check out the code, contribute, or
                  fork it for your own projects.
                </p>
                <Button asChild>
                  <a
                    href="https://github.com/lalit79/pollman"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </StaticPageShell>
      <Footer />
    </>
  );
}
