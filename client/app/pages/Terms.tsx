import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Terms
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground max-w-3xl">
          These terms govern your use of the POLLMAN application, including poll
          creation, response collection, and published results.
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Acceptance of terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            By using POLLMAN, you agree to comply with the platform’s rules for
            creating, publishing, and sharing polls. You are responsible for
            ensuring poll content follows applicable laws and does not violate
            privacy or intellectual property rights.
          </p>
          <p>
            The service is provided as-is, and POLLMAN does not guarantee that
            polling results will meet any specific outcome or performance
            metric.
          </p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Usage rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>
              Do not use POLLMAN for abusive, illegal, or harmful purposes.
            </li>
            <li>Respect respondent privacy and data collection regulations.</li>
            <li>Only authorized users may manage and publish poll results.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/privacy">Privacy Policy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/documentation">Documentation</Link>
        </Button>
      </div>
    </div>
  );
}
