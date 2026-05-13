import { Link, useLocation } from "react-router";
import { StaticPageShell } from "../components/ui/StaticPageShell";
import { Button } from "../components/ui/button";

const tabs = [
  { label: "Terms of Service", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
];

export default function LegalPage() {
  const location = useLocation();
  const activePath = location.pathname;
  const showPrivacy = activePath === "/privacy";

  return (
    <StaticPageShell
      title={showPrivacy ? "Privacy Policy" : "Terms of Service"}
      subtitle="Legal information for POLLMAN users"
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {tabs.map((tab) => (
          <Link key={tab.path} to={tab.path}>
            <Button
              variant={tab.path === activePath ? "solid" : "outline"}
              size="sm"
            >
              {tab.label}
            </Button>
          </Link>
        ))}
      </div>

      {showPrivacy ? (
        <div className="space-y-6 text-muted-foreground">
          <p>
            POLLMAN collects the minimum data required to operate the polling
            platform, including authenticated user details and poll response
            metadata.
          </p>
          <p>
            Anonymous polls may collect responses without user identification,
            while authenticated polls store user information for response
            tracking and dashboard analytics.
          </p>
          <p>
            Data is stored securely and used only to power your poll dashboards,
            publish results, and support the app experience.
          </p>
          <p>
            If you want your data removed, please use the account settings or
            contact the application administrator.
          </p>
        </div>
      ) : (
        <div className="space-y-6 text-muted-foreground">
          <p>
            By using POLLMAN, you agree to follow the platform’s rules for
            creating, sharing, and publishing polls. All poll content must
            comply with applicable laws and respect respondent privacy.
          </p>
          <p>
            The service is provided as-is; POLLMAN does not guarantee any
            specific results or outcomes from published polls.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and for all activity that occurs under your account.
          </p>
          <p>
            POLLMAN reserves the right to suspend access, remove content, or
            disable accounts for violations of these terms.
          </p>
        </div>
      )}
    </StaticPageShell>
  );
}
