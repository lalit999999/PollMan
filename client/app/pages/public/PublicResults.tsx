import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function PublicResults() {
  const { id } = useParams();

  const results = [
    { name: 'Dark Mode', votes: 450 },
    { name: 'AI Features', votes: 320 },
    { name: 'Performance', votes: 280 },
    { name: 'Integrations', votes: 195 },
  ];

  const total = results.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8 mt-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Live Results</h1>
          <p className="text-muted-foreground">Product Features Survey 2026</p>
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {total.toLocaleString()} total responses
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Which feature should we prioritize for Q1?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.map((result, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{result.name}</span>
                  <span className="text-muted-foreground">{Math.round((result.votes / total) * 100)}% ({result.votes})</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(result.votes / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="text-center pt-12">
          <Button asChild variant="outline" className="glass">
            <Link to="/">Create your own poll</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
