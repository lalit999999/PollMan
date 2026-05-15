import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Link } from "react-router";
import {
  Users,
  TrendingUp,
  Clock,
  BarChart2,
  Activity,
  Plus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboardOverview } from "../../services/pollService";
import { toast } from "sonner";
import { connectSocket, disconnectSocket } from "../../lib/socketClient";
import { useAuth } from "../../context/AuthContext";

function formatTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function DashboardHome() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDashboardOverview();
        setOverview(data);
      } catch (error: any) {
        console.error("Failed to load dashboard overview", error);
        toast.error(
          error.response?.data?.message || "Failed to load dashboard overview.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  // Socket connection for real-time updates
  useEffect(() => {
    const socket = connectSocket();

    const joinCreatorRoom = () => {
      const socketId = socket.id;
      if (!socketId) return;

      socket.emit("join:creator", {
        userId: user?._id,
        socketId,
      });
    };

    if (socket.connected) {
      joinCreatorRoom();
    } else {
      socket.on("connect", joinCreatorRoom);
    }

    // Listen for analytics updates
    const handleAnalyticsUpdate = (data: any) => {
      console.log("Dashboard analytics update received:", data);
      // Refresh dashboard data when analytics change
      const load = async () => {
        try {
          const updatedData = await getDashboardOverview();
          setOverview(updatedData);
        } catch (error) {
          console.error("Failed to refresh dashboard overview", error);
        }
      };
      void load();
    };

    socket.on("poll:analytics:update", handleAnalyticsUpdate);

    return () => {
      socket.off("connect", joinCreatorRoom);
      socket.off("poll:analytics:update", handleAnalyticsUpdate);
      disconnectSocket();
    };
  }, [user?._id]);

  const timeline = useMemo(() => overview?.activityTimeline || [], [overview]);

  const stats = overview?.stats || {
    totalPolls: 0,
    totalResponses: 0,
    activePolls: 0,
    draftPolls: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your polls today.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/polls/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Polls",
            value: stats.totalPolls,
            icon: BarChart2,
            change: "All drafts + live",
          },
          {
            title: "Total Responses",
            value: stats.totalResponses,
            icon: Users,
            change: "Across all polls",
          },
          {
            title: "Active Polls",
            value: stats.activePolls,
            icon: TrendingUp,
            change: "Currently live",
          },
          {
            title: "Draft Polls",
            value: stats.draftPolls,
            icon: Clock,
            change: "Saved but not live",
          },
        ].map((stat, i) => (
          <Card key={i} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">
                  {loading ? "—" : stat.value.toLocaleString()}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 glass">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Live access and response activity from your polls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {timeline.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeline}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorResponses"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--primary)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "var(--foreground)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="responses"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorResponses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                  No activity yet. As users view and answer polls, the graph
                  will populate here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass flex flex-col">
          <CardHeader>
            <CardTitle>Recent Polls</CardTitle>
            <CardDescription>
              Your most recently created or updated polls.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading recent polls...
              </div>
            ) : overview?.recentPolls?.length ? (
              overview.recentPolls.map((poll: any) => {
                const isExpired =
                  poll.expiresAt && new Date(poll.expiresAt) < new Date();
                const status = poll.resultsPublished
                  ? "Results Published"
                  : isExpired
                    ? "Closed"
                    : poll.isPublished
                      ? "Active"
                      : "Draft";

                return (
                  <Link
                    key={poll._id}
                    to={`/app/polls/${poll._id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="space-y-1 truncate pr-4 max-w-[70%]">
                      <p className="font-medium leading-none truncate">
                        {poll.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {poll.description || "No description provided."}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span>{poll.totalResponses || 0} responses</span>
                        <span>•</span>
                        <span>{formatTime(poll.createdAt)}</span>
                      </div>
                    </div>
                    <Badge
                      variant={status === "Active" ? "success" : "secondary"}
                    >
                      {status}
                    </Badge>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No polls created yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Activity Feed</CardTitle>
            <CardDescription>
              Latest views, responses, and publish actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Loading activity...
              </div>
            ) : overview?.recentActivity?.length ? (
              overview.recentActivity.slice(0, 8).map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize">
                      {item.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No recent activity yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump straight into the next task.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/app/polls">
                <BarChart2 className="w-4 h-4 mr-2" />
                View Polls
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/app/settings">
                <Users className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
