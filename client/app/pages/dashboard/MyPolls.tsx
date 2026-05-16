import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Copy,
  BarChart2,
  Edit3,
  PlayCircle,
  Radio,
} from "lucide-react";
import { motion } from "motion/react";
import {
  getMyPolls,
  publishPoll,
  publishPollResults,
  ApiPoll,
} from "../../services/pollService";
import { toast } from "sonner";
import { Loader } from "../../components/ui/Loader";

export default function MyPolls() {
  const [search, setSearch] = useState("");
  const [polls, setPolls] = useState<ApiPoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<{
    poll: ApiPoll;
    type: "publish" | "results";
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadPolls = async () => {
    setIsLoading(true);
    try {
      const result = await getMyPolls();
      setPolls(result.polls || []);
    } catch (error: any) {
      console.error("Error fetching polls:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch polls. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPolls();
  }, []);

  const filteredPolls = useMemo(
    () =>
      polls.filter((poll) =>
        poll.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [polls, search],
  );

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setActionLoading(true);
    try {
      if (pendingAction.type === "publish") {
        await publishPoll(pendingAction.poll._id);
        toast.success("Poll published successfully.");
      } else {
        await publishPollResults(pendingAction.poll._id);
        toast.success("Poll results published successfully.");
      }
      setPendingAction(null);
      await loadPolls();
    } catch (error: any) {
      console.error("Failed to publish poll action:", error);
      toast.error(error.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Polls</h2>
          <p className="text-muted-foreground">
            Manage and track all your polls in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/polls/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search polls..."
            className="pl-9 bg-card glass"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="glass w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-16 flex items-center justify-center">
            <Loader label="Loading polls" />
          </div>
        ) : (
          filteredPolls.map((poll, i) => {
            const isExpired =
              poll.expiresAt && new Date(poll.expiresAt) < new Date();
            const status = poll.resultsPublished
              ? "Results Published"
              : isExpired
                ? "Closed"
                : poll.isPublished
                  ? "Active"
                  : "Draft";
            const primaryAction = !poll.isPublished
              ? { label: "Publish", type: "publish" as const }
              : !poll.resultsPublished
                ? { label: "Publish Results", type: "results" as const }
                : null;

            return (
              <motion.div
                key={poll._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass h-full flex flex-col hover:border-primary/50 transition-colors group">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <Badge
                        variant={
                          status === "Active"
                            ? "success"
                            : status === "Results Published"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <Link
                      to={`/app/polls/${poll._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                        {poll.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {poll.description || "No description provided."}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Created{" "}
                      {new Date(
                        poll.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-primary" />
                        {(poll as any).totalResponses || 0} responses
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-primary"
                        title="Copy public link"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `${window.location.origin}/p/${poll._id}`,
                          );
                          toast.success("Link copied to clipboard!");
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Link to={`/app/polls/${poll._id}`}>
                          <Radio className="w-4 h-4" />
                          View
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Link to={`/app/polls/${poll._id}/edit`}>
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Link>
                      </Button>

                      {primaryAction ? (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            setPendingAction({ poll, type: primaryAction.type })
                          }
                        >
                          <PlayCircle className="w-4 h-4" />
                          {primaryAction.label}
                        </Button>
                      ) : (
                        <Button
                          asChild
                          size="sm"
                          variant="secondary"
                          className="gap-2"
                        >
                          <Link to={`/p/${poll._id}/results`}>Results</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {!isLoading && filteredPolls.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No polls found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.type === "publish"
                ? "Publish this poll?"
                : "Publish final results?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "publish"
                ? "This will make the poll live so respondents can answer it."
                : "This will mark the poll results as ready to view publicly."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {actionLoading ? "Working..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
