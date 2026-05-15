import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  getProfileSummary,
  updateProfile,
} from "../../services/userService";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { BarChart3, Edit3, Users } from "lucide-react";

type ProfileSummary = {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  totalResponsesReceived: number;
  createdPolls: Array<{
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
    isPublished?: boolean;
    responseCount?: number;
  }>;
  topPolls: Array<{
    _id: string;
    title: string;
    description?: string;
    responseCount?: number;
  }>;
};

export default function ProfilePage() {
  const { user, setUser } = useAuth() as any;
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const sourceName = summary?.user?.name || user?.name || "";
    const parts = sourceName.split(" ");
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
  }, [summary?.user?.name, user?.name]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProfileSummary();
        if (res?.data) setSummary(res.data);
      } catch (error) {
        console.error("Failed to load profile summary", error);
        toast.error("Failed to load profile summary.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user?._id]);

  async function handleSave() {
    setSaving(true);
    try {
      const name = [firstName, lastName].filter(Boolean).join(" ");
      const res = await updateProfile({ name });
      if (res) {
        const fresh = await getProfile();
        if (fresh) setUser(fresh);
        const refreshed = await getProfileSummary();
        if (refreshed?.data) setSummary(refreshed.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Failed to save profile", error);
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading profile...</div>;
  }

  const profile = summary?.user || user;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            View and edit your account, created polls, and response summary.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/app/settings">
            <Edit3 className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass">
          <CardHeader>
            <CardTitle>User information</CardTitle>
            <CardDescription>Edit your display name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {profile?.avatar ? (
                  <>
                    <img
                      src={profile.avatar}
                      alt={profile.name || "avatar"}
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <span>{profile?.name?.[0]?.toUpperCase() || "U"}</span>
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {profile?.name || "Unnamed user"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={profile?.email || ""} disabled />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="glass">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Polls created</p>
              </div>
              <p className="text-3xl font-bold">
                {summary?.createdPolls?.length || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Total responses received
                </p>
              </div>
              <p className="text-3xl font-bold">
                {summary?.totalResponsesReceived || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Top 3 polls</CardTitle>
            <CardDescription>
              Your polls with the most responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(summary?.topPolls || []).length ? (
              (summary?.topPolls || []).map((poll, index) => (
                <div
                  key={poll._id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <p className="font-semibold">{poll.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {poll.description || "No description"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {poll.responseCount || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">responses</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No polls created yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Created polls</CardTitle>
            <CardDescription>
              All polls you have created, with response counts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[520px] overflow-auto pr-1">
            {(summary?.createdPolls || []).length ? (
              (summary?.createdPolls || []).map((poll) => (
                <div
                  key={poll._id}
                  className="rounded-xl border border-border bg-background/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{poll.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {poll.createdAt
                          ? new Date(poll.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                    <Badge variant={poll.isPublished ? "default" : "secondary"}>
                      {poll.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Responses</span>
                    <span className="font-semibold">
                      {poll.responseCount || 0}
                    </span>
                  </div>
                  <Button variant="ghost" className="px-0" asChild>
                    <Link to={`/app/polls/${poll._id}`}>View details</Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                You haven't created any polls yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
