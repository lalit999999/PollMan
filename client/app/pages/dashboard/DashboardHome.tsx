import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, MousePointerClick, TrendingUp, Clock } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router";

const data = [
  { name: "Mon", responses: 400 },
  { name: "Tue", responses: 300 },
  { name: "Wed", responses: 550 },
  { name: "Thu", responses: 450 },
  { name: "Fri", responses: 700 },
  { name: "Sat", responses: 200 },
  { name: "Sun", responses: 800 },
];

const RECENT_POLLS = [
  { id: "1", title: "Product Features Survey 2026", responses: 1245, status: "Active", date: "2 hours ago" },
  { id: "2", title: "Employee Satisfaction Q2", responses: 84, status: "Active", date: "1 day ago" },
  { id: "3", title: "Website Redesign Feedback", responses: 320, status: "Closed", date: "3 days ago" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Here's what's happening with your polls today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Responses", value: "12,450", icon: Users, change: "+14%" },
          { title: "Active Polls", value: "8", icon: TrendingUp, change: "+2" },
          { title: "Completion Rate", value: "68%", icon: MousePointerClick, change: "+5.4%" },
          { title: "Avg. Time", value: "1m 24s", icon: Clock, change: "-12s" },
        ].map((stat, i) => (
          <Card key={i} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stat.value}</div>
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-primary' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 glass">
          <CardHeader>
            <CardTitle>Response Volume</CardTitle>
            <CardDescription>Daily responses across all active polls over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="responses" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorResponses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass flex flex-col">
          <CardHeader>
            <CardTitle>Recent Polls</CardTitle>
            <CardDescription>Your most recently created or updated polls.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            {RECENT_POLLS.map((poll) => (
              <Link 
                key={poll.id} 
                to={`/app/polls/${poll.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="space-y-1 truncate pr-4">
                  <p className="font-medium leading-none truncate">{poll.title}</p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span>{poll.responses} responses</span>
                    <span>•</span>
                    <span>{poll.date}</span>
                  </div>
                </div>
                <Badge variant={poll.status === "Active" ? "success" : "secondary"}>
                  {poll.status}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
