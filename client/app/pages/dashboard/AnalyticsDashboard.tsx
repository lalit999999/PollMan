import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Download, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getPollAnalytics } from "../../services/pollService";
import { toast } from "sonner";

const COLORS = [
  "var(--primary)",
  "var(--accent)",
  "#3b82f6",
  "#8b5cf6",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#10b981",
];

export default function AnalyticsDashboard() {
  const { id } = useParams<{ id: string }>();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  

  const fetchAnalytics = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getPollAnalytics(id);
      setAnalytics(response.data);
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast.error(
        error.response?.data?.message || "Failed to load analytics. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Error loading analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Analytics for {analytics.title}
          </h2>
          <p className="text-muted-foreground">
            Total Responses: {analytics.totalResponses} | Completion Rate:{" "}
            {analytics.completionRate}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="glass"
            onClick={fetchAnalytics}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {analytics.questionAnalytics && analytics.questionAnalytics.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {analytics.questionAnalytics.map((q: any, i: number) => {
            const chartData = q.options.map((opt: any) => ({
              name:
                opt.text.length > 20
                  ? opt.text.substring(0, 20) + "..."
                  : opt.text,
              value: opt.count,
              originalTitle: opt.text,
            }));
            return (
              <Card className="glass" key={q.questionId || i}>
                <CardHeader>
                  <CardTitle className="text-lg">Question {i + 1}</CardTitle>
                  <CardDescription>{q.questionText}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center flex-col">
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ color: "var(--foreground)" }}
                          formatter={(value: any, name: any, props: any) => [
                            value,
                            props.payload.originalTitle,
                          ]}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {q.responseCount} responses ({q.responsePercentage}%)
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground bg-card glass rounded-xl border border-border">
          No question analytics available yet.
        </div>
      )}

      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Responses</CardTitle>
          <CardDescription>
            The latest submissions to this poll.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">User / IP</th>
                  <th className="px-6 py-3 text-center">Completion</th>
                  <th className="px-6 py-3 rounded-tr-lg">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentResponses &&
                analytics.recentResponses.length > 0 ? (
                  analytics.recentResponses.map((row: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        {row.isAnonymous ? "Anonymous User" : "User"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.completionPercentage}%
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(row.respondedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No recent responses.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
