import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ExternalLink, Copy, Share2, QrCode, ArrowLeft, BarChart2, Users, Clock, Settings } from "lucide-react";

export default function PollDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link to="/app/polls">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Product Features Survey 2026</h1>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Created on October 24, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass">
            <Settings className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button asChild>
            <Link to={`/app/analytics?poll=${id}`}>
              <BarChart2 className="w-4 h-4 mr-2" />
              Full Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Analytics</CardTitle>
              <CardDescription>At a glance performance metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Responses</span>
                  </div>
                  <div className="text-3xl font-bold">1,245</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Avg. Completion Time</span>
                  </div>
                  <div className="text-3xl font-bold">1m 12s</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Questions (3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { q: "Which feature should we prioritize for Q1?", type: "Multiple Choice" },
                { q: "How satisfied are you with the current UI?", type: "Rating (1-5)" },
                { q: "Any additional feedback?", type: "Text Answer" }
              ].map((q, i) => (
                <div key={i} className="flex items-start justify-between p-4 rounded-lg border border-border bg-muted/10">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground mb-1 block">Question {i + 1}</span>
                    <p className="font-medium">{q.q}</p>
                  </div>
                  <Badge variant="outline">{q.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader>
              <CardTitle>Share Poll</CardTitle>
              <CardDescription>Get more responses by sharing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Public Link</label>
                <div className="flex gap-2">
                  <Input readOnly value={`https://pollform.app/p/${id || 'demo'}`} className="bg-muted/50 font-mono text-xs" />
                  <Button variant="secondary" size="icon" className="shrink-0">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full gap-2" variant="outline">
                <ExternalLink className="w-4 h-4" />
                Open Public Page
              </Button>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <QrCode className="w-4 h-4 text-muted-foreground" />
                <span>QR Code</span>
              </div>
              <Button size="sm" variant="ghost">Download</Button>
            </CardFooter>
          </Card>

          <Card className="glass border-dashed border-2 bg-transparent">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1">Embed in your app</h3>
              <p className="text-sm text-muted-foreground mb-4">Integrate this poll directly into your website or React app.</p>
              <Button variant="outline" className="w-full">View Documentation</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
