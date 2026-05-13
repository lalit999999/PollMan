import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getPublicResults } from "../../services/pollService";
import { toast } from "sonner";

export default function PublicResults() {
  const { id } = useParams();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getPublicResults(id);
        setResults(data);
      } catch (error: any) {
        console.error("Failed to load public results", error);
        toast.error(error.response?.data?.message || "Unable to load results.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const chartData = useMemo(() => {
    const question = results?.questions?.[0];
    if (!question) return [];
    return question.options.map((option: any) => ({
      name: option.text,
      votes: option.count,
    }));
  }, [results]);

  const total =
    results?.totalResponses ||
    chartData.reduce((acc: number, curr: any) => acc + curr.votes, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="text-center text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center justify-center">
        <Card className="glass w-full max-w-xl">
          <CardHeader>
            <CardTitle>Results not available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>This poll&apos;s results are not published yet.</p>
            <Button asChild variant="outline" className="glass">
              <Link to={id ? `/p/${id}` : "/"}>Back to Poll</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8 mt-4">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Live Results</h1>
          <p className="text-muted-foreground">{results.title}</p>
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {total.toLocaleString()} total responses
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>{results.description || "Results breakdown"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                  <Bar
                    dataKey="votes"
                    fill="var(--primary)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {results.questions?.map((question: any, qIndex: number) => (
              <div key={question._id || qIndex} className="space-y-3">
                <h3 className="font-semibold text-lg">
                  Question {qIndex + 1}: {question.text}
                </h3>
                <div className="space-y-3">
                  {question.options.map((result: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{result.text}</span>
                        <span className="text-muted-foreground">
                          {result.percentage}% ({result.count})
                        </span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <Button asChild variant="outline" className="glass">
            <Link to={id ? `/p/${id}` : "/"}>Back to Poll</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
