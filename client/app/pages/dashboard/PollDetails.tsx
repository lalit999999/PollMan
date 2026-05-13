import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  ExternalLink,
  Copy,
  Share2,
  QrCode,
  ArrowLeft,
  BarChart2,
  Users,
  Clock,
  Settings,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPollAnalytics,
  getPollById,
  deletePoll,
  publishPoll,
  publishPollResults,
  type ApiPoll,
} from "../../services/pollService";
import { useAuth } from "../../context/AuthContext";
import { connectSocket, disconnectSocket } from "../../lib/socketClient";

type PollAnalytics = {
  pollId: string;
  title: string;
  totalResponses: number;
  completionRate: number;
  completionPercentage: number;
  averageCompletion: number;
  expiresAt: string | null;
  resultsPublished?: boolean;
  questionAnalytics: Array<{
    questionId: string;
    text: string;
    isRequired: boolean;
    totalResponses: number;
    options: Array<{
      text: string;
      count: number;
      percentage: number;
    }>;
  }>;
  timeline?: {
    hourly?: Array<{ bucket: string; count: number }>;
    daily?: Array<{ bucket: string; count: number }>;
  };
  recentResponses?: Array<{
    respondedAt: string;
    completionPercentage: number;
    isAnonymous: boolean;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function PollDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<ApiPoll | null>(null);
  const [analytics, setAnalytics] = useState<PollAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishMode, setPublishMode] = useState<"publish" | "results" | null>(
    null,
  );
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) {
        toast.error("Poll id is missing.");
        return;
      }

      setIsLoading(true);
      try {
        const [pollResponse, analyticsResponse] = await Promise.allSettled([
          getPollById(id),
          getPollAnalytics(id),
        ]);

        if (pollResponse.status === "fulfilled") {
          const pollData =
            (pollResponse.value as any).data || pollResponse.value;
          setPoll(pollData as ApiPoll);
        } else {
          throw pollResponse.reason;
        }

        if (analyticsResponse.status === "fulfilled") {
          const analyticsData =
            (analyticsResponse.value as any).data || analyticsResponse.value;
          setAnalytics(analyticsData as PollAnalytics);
        } else {
          setAnalytics(null);
        }
      } catch (error: any) {
        console.error("Error loading poll details:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load poll details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await deletePoll(id);
      toast.success("Poll deleted successfully!");
      navigate("/app/polls");
    } catch (error: any) {
      console.error("Error deleting poll:", error);
      toast.error(error.response?.data?.message || "Failed to delete poll.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isExpired = useMemo(() => {
    if (!poll?.expiresAt) return false;
    return new Date(poll.expiresAt) < new Date();
  }, [poll?.expiresAt]);

  const statusLabel = poll?.resultsPublished
    ? "Results Published"
    : isExpired
      ? "Closed"
      : poll?.isPublished
        ? "Active"
        : "Draft";

  const publicLink = `${window.location.origin}/p/${id}`;
  const { user } = useAuth() as any;
  const isCreator = !!(
    user &&
    poll &&
    String(poll.createdBy) === String(user._id)
  );
  const publicLinkWithPreview = isCreator
    ? `${publicLink}?preview=1`
    : publicLink;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    publicLinkWithPreview,
  )}`;

  const copyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLinkWithPreview);
      toast.success("Public link copied to clipboard!");
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const handlePublish = async () => {
    if (!id || !publishMode) return;

    setIsPublishing(true);
    try {
      if (publishMode === "publish") {
        const updated = await publishPoll(id);
        setPoll(updated as ApiPoll);
        toast.success("Poll published successfully.");
      } else {
        const updated = await publishPollResults(id);
        setPoll((updated as ApiPoll) || poll);
        toast.success("Poll results published successfully.");
      }
    } catch (error: any) {
      console.error("Publish action failed:", error);
      toast.error(error.response?.data?.message || "Failed to publish.");
    } finally {
      setIsPublishing(false);
      setPublishMode(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse pb-20">
        <div className="h-24 rounded-2xl border border-border bg-muted/20" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="h-52 rounded-2xl border border-border bg-muted/20" />
            <div className="h-72 rounded-2xl border border-border bg-muted/20" />
          </div>
          <div className="space-y-6">
            <div className="h-56 rounded-2xl border border-border bg-muted/20" />
            <div className="h-44 rounded-2xl border border-border bg-muted/20" />
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-muted-foreground">
        Poll details could not be loaded.
      </div>
    );
  }

  const analyticsData: PollAnalytics = analytics ?? {
    pollId: poll._id,
    title: poll.title,
    totalResponses: poll.totalResponses || 0,
    completionRate: 0,
    completionPercentage: 0,
    averageCompletion: 0,
    expiresAt: poll.expiresAt || null,
    resultsPublished: poll.resultsPublished,
    questionAnalytics: (poll.questions || []).map((question) => ({
      questionId: question._id || "",
      text: question.text,
      isRequired: question.isRequired,
      totalResponses: 0,
      options: (question.options || []).map((option) => ({
        text: option.text,
        count: option.count || 0,
        percentage: 0,
      })),
    })),
    timeline: { hourly: [], daily: [] },
    recentResponses: [],
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link to="/app/polls">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{poll.title}</h1>
            <Badge variant={statusLabel === "Active" ? "success" : "secondary"}>
              {statusLabel}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Created on {formatDate(poll.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass" asChild>
            <Link to={`/app/polls/${id}/edit`}>
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          {!poll.isPublished ? (
            <Button onClick={() => setPublishMode("publish")}>Publish</Button>
          ) : !poll.resultsPublished ? (
            <Button onClick={() => setPublishMode("results")}>
              Publish Results
            </Button>
          ) : (
            <Button asChild>
              <Link to={`/p/${id}/results`}>Results</Link>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-10 w-10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Poll?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  poll "{poll.title}" and all its responses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <AlertDialog
        open={!!publishMode}
        onOpenChange={(open) => {
          if (!open) setPublishMode(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishMode === "publish"
                ? "Publish this poll?"
                : "Publish poll results?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {publishMode === "publish"
                ? "This will make the poll available to respondents on the public link."
                : "This will make the final results visible on the public results page."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isPublishing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPublishing ? "Working..." : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Analytics</CardTitle>
              <CardDescription>
                At a glance performance metrics for this poll.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analytics && (
                <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  Analytics are temporarily unavailable, so this section is
                  showing poll defaults.
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Total Responses</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {analyticsData.totalResponses}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Avg. Completion</span>
                  </div>
                  <div className="text-3xl font-bold">
                    {analyticsData.averageCompletion}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Questions ({poll.questions?.length || 0})</CardTitle>
              <CardDescription>
                Individual question breakdown from the poll document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {poll.questions?.length ? (
                poll.questions.map((question, i) => {
                  const questionAnalytics = analyticsData.questionAnalytics[i];
                  return (
                    <div
                      key={question._id || i}
                      className="p-4 rounded-lg border border-border bg-muted/10 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground mb-1 block">
                            Question {i + 1}
                          </span>
                          <p className="font-medium">{question.text}</p>
                        </div>
                        <Badge variant="outline">
                          {question.isRequired ? "Required" : "Optional"}
                        </Badge>
                      </div>

                      <div className="grid gap-2">
                        {question.options?.map((option) => {
                          const analyticsOption =
                            questionAnalytics?.options.find(
                              (entry) => entry.text === option.text,
                            );
                          return (
                            <div
                              key={
                                option._id ||
                                `${question._id || i}-${option.text}`
                              }
                              className="flex items-center justify-between rounded-md border border-border bg-background/60 px-3 py-2 text-sm"
                            >
                              <span>{option.text}</span>
                              <span className="text-muted-foreground">
                                {analyticsOption?.count ?? option.count ?? 0}{" "}
                                votes
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No questions found for this poll.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader>
              <CardTitle>Poll Info</CardTitle>
              <CardDescription>
                {poll.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Published</span>
                <span>{poll.isPublished ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Results Published</span>
                <span>{poll.resultsPublished ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Expires At</span>
                <span>{formatDate(poll.expiresAt)}</span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <QrCode className="w-4 h-4 text-muted-foreground" />
                <span>Shareable poll link</span>
              </div>
              <Button size="sm" variant="ghost" onClick={copyPublicLink}>
                Copy
              </Button>
            </CardFooter>
          </Card>

          <Card className="glass overflow-hidden">
            <CardHeader>
              <CardTitle>Share Poll</CardTitle>
              <CardDescription>Get more responses by sharing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Share link
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Copy or scan the link below to share this poll.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={copyPublicLink}
                    className="shrink-0 gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={publicLinkWithPreview}
                    className="bg-background/70 font-mono text-xs border-border/70"
                  />
                </div>

                <Button className="w-full gap-2" variant="outline" asChild>
                  <Link
                    to={
                      publicLinkWithPreview.replace(
                        window.location.origin,
                        "",
                      ) || `/p/${id}`
                    }
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Public Page
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-4 w-full">
                <div className="rounded-2xl bg-background p-3 border border-border shadow-sm">
                  <img
                    src={qrUrl}
                    alt="QR code"
                    className="w-28 h-28 rounded-xl bg-white p-1"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">QR Code</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[18rem]">
                    Scan to open the poll on mobile. The code encodes the same
                    share link shown above.
                  </p>
                  <a
                    href={qrUrl}
                    download={`poll-${id}-qr.png`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/15 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Download QR PNG
                  </a>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Analytics section</CardTitle>
              <CardDescription>
                Live analytics now live inside the sidebar instead of a separate
                page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Responses
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {analyticsData.totalResponses}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Completion
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {analyticsData.completionPercentage}%
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-3 space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Question breakdown
                </p>
                {analyticsData.questionAnalytics
                  ?.slice(0, 3)
                  .map((question, index) => (
                    <div
                      key={question.questionId || index}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-muted-foreground truncate">
                        Q{index + 1}
                      </span>
                      <span className="font-medium">
                        {question.totalResponses} votes
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-dashed border-2 bg-transparent">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1">Recent activity</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Latest submissions and response timing are shown in the
                analytics sidebar.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/app/polls/${id}`}>Refresh Poll Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
