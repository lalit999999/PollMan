import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";
import {
  unlinkProvider,
  updateProfile,
  getProfile,
} from "../../services/userService";
import { useState, useEffect } from "react";
import { AUTH_BASE_URL } from "../../services/runtimeConfig";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useAuth() as any;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || "").split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [user]);

  async function handleSave() {
    setLoading(true);
    try {
      const name = [firstName, lastName].filter(Boolean).join(" ");
      const payload: any = { name };

      const res = await updateProfile(payload);
      if (res) {
        // refresh profile
        const fresh = await getProfile();
        if (fresh) setUser(fresh);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and integrations.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/content/logo.png"
                    alt="POLLMAN"
                    className="w-full h-full object-cover"
                  />
                )}
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                disabled
              />
            </div>
            {/* Avatar URL removed — avatar is managed via connected accounts or gravatar */}
            <div className="pt-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how PollForm looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"}`}
              >
                <div className="w-full h-20 bg-[#faf9f6] rounded-md border border-[#e5e0d8] mb-3 shadow-sm flex flex-col gap-2 p-2">
                  <div className="w-full h-4 bg-[#f5f2eb] rounded-sm" />
                  <div className="w-2/3 h-4 bg-[#f5f2eb] rounded-sm" />
                </div>
                <span className="font-medium">Light</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"}`}
              >
                <div className="w-full h-20 bg-[#0f0f0f] rounded-md border border-[#262626] mb-3 shadow-sm flex flex-col gap-2 p-2">
                  <div className="w-full h-4 bg-[#171717] rounded-sm" />
                  <div className="w-2/3 h-4 bg-[#171717] rounded-sm" />
                </div>
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>Manage your SSO and integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google */}
            <ConnectedAccount
              provider="google"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            />

            {/* GitHub integration removed */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConnectedAccount({
  provider,
  icon,
}: {
  provider: "google"; // GitHub removed
  icon: React.ReactNode;
}) {
  const { user, setUser } = useAuth() as any;
  const [loading, setLoading] = useState(false);

  const connected = !!(provider === "google" ? user?.googleId : false);

  const connectUrl = `${AUTH_BASE_URL}/google`;

  async function handleDisconnect() {
    if (!connected) return;
    setLoading(true);
    try {
      const res = await unlinkProvider(provider);
      if (res) {
        // fetch fresh profile
        const fresh = await getProfile();
        if (fresh) setUser(fresh);
      }
    } catch (err) {
      console.error("Failed to disconnect provider:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">Google</p>
          <p className="text-sm text-muted-foreground">
            {connected ? `Connected as ${user?.email}` : "Not connected"}
          </p>
        </div>
      </div>
      {connected ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={loading}
        >
          {loading ? "Disconnecting..." : "Disconnect"}
        </Button>
      ) : (
        <a href={connectUrl} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">
            Connect
          </Button>
        </a>
      )}
    </div>
  );
}
