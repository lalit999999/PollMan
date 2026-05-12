import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Download, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";

const COLORS = ['var(--primary)', 'var(--accent)', '#3b82f6', '#8b5cf6', '#6366f1'];

const pieData = [
  { name: 'Option A (Dark Mode)', value: 400 },
  { name: 'Option B (AI Features)', value: 300 },
  { name: 'Option C (Performance)', value: 300 },
  { name: 'Option D (Integrations)', value: 200 },
];

const barData = [
  { name: 'Marketing', participants: 40 },
  { name: 'Engineering', participants: 85 },
  { name: 'Design', participants: 65 },
  { name: 'Sales', participants: 35 },
  { name: 'Product', participants: 55 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Deep dive into your poll responses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Feature Priorities</CardTitle>
            <CardDescription>Responses for Question 1: "Which feature should we prioritize?"</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Participant Demographics</CardTitle>
            <CardDescription>Breakdown of responses by department.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="participants" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Responses</CardTitle>
          <CardDescription>The latest submissions across all your polls.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">User / IP</th>
                  <th className="px-6 py-3">Poll</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: "Anonymous (192.168...)", poll: "Product Features Survey 2026", time: "2 mins ago" },
                  { user: "sarah@example.com", poll: "Employee Satisfaction Q2", time: "15 mins ago" },
                  { user: "Anonymous (10.0.0...)", poll: "Product Features Survey 2026", time: "1 hour ago" },
                  { user: "mike@company.com", poll: "Website Redesign Feedback", time: "3 hours ago" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.user}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.poll}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.time}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
