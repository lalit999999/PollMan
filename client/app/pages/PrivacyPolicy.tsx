import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Privacy
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-3xl">
          We care about your data. This policy explains how POLLMAN collects,
          stores, and uses information from creators and respondents.
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Data collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            POLLMAN collects minimal profile and poll data required to run the
            service, including authenticated user details and poll responses.
            Anonymous polls can collect responses without tying them to a
            specific user account.
          </p>
          <p>
            We do not sell personal data. Data is used only to power poll
            analytics, publish results, and provide the dashboard experience.
          </p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            We use standard security practices to protect stored poll and
            profile information. Access controls ensure only authorized users
            can manage their own polls and view analytics.
          </p>
          <p>
            If you need to delete your account or request data removal, contact
            the app administrator or use built-in settings options where
            available.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/terms">Terms of Service</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/documentation">Documentation</Link>
        </Button>
      </div>
    </div>
  );
}
