import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import "highlight.js/styles/atom-one-dark.css";
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  User,
  Clock,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import {
  getPollById,
  submitPollResponse,
  verifyPollPassword,
  type ApiPoll,
  type PollAnswer,
} from "../../services/pollService";
import { connectSocket, disconnectSocket } from "../../lib/socketClient";

export default function PublicPoll() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [poll, setPoll] = useState<ApiPoll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [opinion, setOpinion] = useState("");
  const [answers, setAnswers] = useState<PollAnswer[]>([]);
  const [isCreator, setIsCreator] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [pollExpired, setPollExpired] = useState(false);
  const [responseLimitReached, setResponseLimitReached] = useState(false);
  const [pollNotFound, setPollNotFound] = useState(false);
  const [pollNotPublished, setPollNotPublished] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordChecking, setPasswordChecking] = useState(false);
  const [liveResponseCount, setLiveResponseCount] = useState(0);

  const responseStorageKey = id
    ? `pollman:responded:${id}:${user?._id || "anon"}`
    : null;

  const creatorLabel =
    typeof poll?.createdBy === "object"
      ? (poll?.createdBy as any)?.name
      : (poll as any)?.createdByName ||
        (poll as any)?.creatorName ||
        "Poll creator";

  useEffect(() => {
    const loadPoll = async () => {
      if (!id) {
        setPollNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getPollById(id);
        const pollData = ((response as any).data ?? response) as ApiPoll;
        setPoll(pollData);
        setLiveResponseCount(pollData.totalResponses || 0);

        if (
          responseStorageKey &&
          localStorage.getItem(responseStorageKey) === "true"
        ) {
          setAlreadyResponded(true);
        }

        if (user && pollData.createdBy === user._id) {
          setIsCreator(true);
          return;
        }

        if (pollData.expiresAt) {
          const expiryDate = new Date(pollData.expiresAt);
          if (new Date() > expiryDate) {
            setPollExpired(true);
          }
        }

        // Check if response limit is reached
        if (
          pollData.isResponseLimited &&
          pollData.responseLimit &&
          (pollData.totalResponses ?? 0) >= pollData.responseLimit
        ) {
          setResponseLimitReached(true);
        }

        // If poll is password protected, require verification before answering
        if (pollData.passwordProtected) {
          setPasswordVerified(false);
        }
      } catch (error: any) {
        console.error("Error loading poll:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";

        if (errorMessage.includes("Poll not found")) {
          setPollNotFound(true);
        } else if (errorMessage.includes("Poll not accessible")) {
          setPollNotPublished(true);
        } else if (errorMessage.includes("already responded")) {
          setAlreadyResponded(true);
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadPoll();
  }, [id, user?._id, responseStorageKey]);

  useEffect(() => {
    if (!id || !poll?.isPublished) return;

    const socket = connectSocket();
    socket.emit("join:poll", id);

    const handleResponseNew = (data: any) => {
      if (data.pollId === id) {
        setLiveResponseCount((prev) => prev + 1);
      }
    };

    socket.on("poll:response:new", handleResponseNew);

    return () => {
      socket.off("poll:response:new", handleResponseNew);
      disconnectSocket();
    };
  }, [id, poll?.isPublished]);

  const handleNext = async () => {
    const currentQuestion = poll?.questions[step];
    if (!currentQuestion) return;

    // For opinion-only questions, opinion is required; for regular questions, selection is required
    if (currentQuestion.allowOpinionText) {
      if (!opinion.trim()) {
        toast.error("Please share your thoughts");
        return;
      }
    } else {
      if (!selected) {
        toast.error("Please select an option");
        return;
      }
    }

    const newAnswers: PollAnswer[] = [
      ...answers,
      {
        questionId: currentQuestion._id || "",
        selectedOption: selected || null,
        opinion: opinion.trim(),
      },
    ];

    setAnswers(newAnswers);

    if (step < (poll?.questions.length || 0) - 1) {
      setStep(step + 1);
      setSelected(null);
      setOpinion("");
      return;
    }

    await submitPoll(newAnswers);
  };

  const submitPoll = async (finalAnswers: PollAnswer[]) => {
    if (!id || !poll) return;

    // Check if response limit is reached before submitting
    if (
      poll.isResponseLimited &&
      poll.responseLimit &&
      (poll.totalResponses ?? 0) >= poll.responseLimit
    ) {
      toast.error("Response limit has been reached for this poll");
      setResponseLimitReached(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPollResponse(id, finalAnswers);
      if (responseStorageKey) {
        localStorage.setItem(responseStorageKey, "true");
      }
      setSubmitted(true);
      toast.success("Response submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting response:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit response. Please try again.";
      toast.error(errorMsg);

      if (errorMsg.includes("already responded")) {
        setAlreadyResponded(true);
      } else if (errorMsg.includes("Response limit")) {
        setResponseLimitReached(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPassword = async () => {
    if (!id) return;
    setPasswordChecking(true);
    try {
      await verifyPollPassword(id, passwordValue);
      setPasswordVerified(true);
      toast.success("Password accepted — you may now answer the poll.");
    } catch (err: any) {
      const msg = err?.message || "Incorrect password";
      toast.error(msg.includes("Incorrect") ? "Incorrect poll password" : msg);
      setPasswordVerified(false);
    } finally {
      setPasswordChecking(false);
    }
  };

  if (isCreator) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cannot Answer Own Poll
          </h1>
          <p className="text-muted-foreground text-lg">
            As the poll creator, you cannot answer your own poll. Share this
            link with others to collect responses.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to="/app/polls">Back to Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (pollNotFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Poll Not Found</h1>
          <p className="text-muted-foreground text-lg">
            This poll doesn't exist or has been deleted.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (pollNotPublished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Poll Not Published
          </h1>
          <p className="text-muted-foreground text-lg">
            Please wait for the poll creator to publish the poll before you can
            respond.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Poll Not Found</h1>
          <p className="text-muted-foreground text-lg">
            This poll doesn't exist or has been deleted.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (pollExpired) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Poll Expired</h1>
          <p className="text-muted-foreground text-lg">
            This poll is no longer accepting responses. The expiry date has
            passed.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (responseLimitReached) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Limit Reached</h1>
          <p className="text-muted-foreground text-lg">
            This poll has reached its maximum number of responses and is no
            longer accepting new responses.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (alreadyResponded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Already Responded
          </h1>
          <p className="text-muted-foreground text-lg">
            You have already submitted a response to this poll. Only one
            response per user is allowed.
          </p>
          <div className="pt-8 space-y-4">
            <Button className="w-full" asChild>
              <Link to={`/p/${id}/results`}>View Live Results</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-r border-border bg-muted/30 p-6 sm:p-8 space-y-8 lg:sticky lg:top-0 lg:self-start lg:min-h-screen">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Creator
            </h3>
            <p className="text-sm font-semibold text-foreground">
              {creatorLabel}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Poll info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{poll.title}</p>
              {poll.description && <p>{poll.description}</p>}
              <p>{poll.questions.length} questions</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
                <User className="w-4 h-4" />
                {liveResponseCount}{" "}
                {liveResponseCount === 1 ? "response" : "responses"}
              </div>
              {poll.isResponseLimited && poll.responseLimit && (
                <div className="text-xs">
                  <p className="text-muted-foreground">
                    Limit: {poll.responseLimit} responses
                  </p>
                  {liveResponseCount >= poll.responseLimit ? (
                    <p className="text-red-500 font-medium">
                      ⚠ Response limit reached
                    </p>
                  ) : (
                    <p className="text-amber-600 font-medium">
                      {poll.responseLimit - liveResponseCount} slots remaining
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Your Responses
            </h3>
            <div className="space-y-3">
              {answers.map((answer, idx) => {
                const question = poll.questions.find(
                  (q) => q._id === answer.questionId,
                );
                const optionIndex = question?.options?.findIndex(
                  (option) => option.text === answer.selectedOption,
                );
                const optionLabel =
                  optionIndex !== undefined && optionIndex >= 0
                    ? String.fromCharCode(65 + optionIndex)
                    : "?";

                return (
                  <div
                    key={idx}
                    className="text-sm space-y-1 pb-3 border-b border-border/50"
                  >
                    <p className="text-xs text-muted-foreground font-medium">
                      Q{idx + 1}
                    </p>
                    <p className="font-medium text-foreground">
                      {question?.text}
                    </p>
                    <p className="text-primary">
                      → ({optionLabel}) {answer.selectedOption}
                    </p>
                    {answer.opinion ? (
                      <p className="text-xs whitespace-pre-wrap text-muted-foreground">
                        {answer.opinion}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-sm text-muted-foreground">
              Responses recorded:{" "}
              <span className="font-semibold text-primary">
                {answers.length}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Questions answered:{" "}
              <span className="font-semibold text-primary">
                {answers.length}/{poll.questions.length}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Remaining questions:{" "}
              <span className="font-semibold text-primary">
                {Math.max(poll.questions.length - answers.length, 0)}
              </span>
            </p>
          </div>
        </aside>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Thank you!</h1>
              <p className="text-muted-foreground text-lg mt-2">
                Your response has been recorded{" "}
                {poll.isAnonymous ? "anonymously" : ""}.
              </p>
            </div>
            <div className="pt-8 space-y-4">
              <Button className="w-full" asChild>
                <Link to={`/p/${id}/results`}>View Live Results</Link>
              </Button>
              <div className="text-sm text-muted-foreground pt-8 flex items-center justify-center gap-2">
                Powered by{" "}
                <span className="font-semibold text-foreground">POLLMAN</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If poll is password protected, require entering password before showing questions
  if (poll.passwordProtected && !passwordVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-2xl font-bold">
            This poll is password protected
          </h2>
          <p className="text-muted-foreground">
            Enter the password to access and respond to this poll.
          </p>
          <div className="space-y-2">
            <input
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Enter poll password"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleVerifyPassword}
                disabled={passwordChecking || !passwordValue}
              >
                {passwordChecking ? "Checking..." : "Unlock"}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.assign("/")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = poll.questions[step];
  const pollProgress = ((step + 1) / poll.questions.length) * 100;
  const currentSelectionSummary = selected || "No option selected yet";

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="order-2 lg:order-1 w-full lg:w-80 border-t lg:border-t-0 lg:border-r border-border bg-muted/30 p-6 sm:p-8 lg:sticky lg:top-0 lg:self-start lg:min-h-screen space-y-8">
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Creator
          </h3>
          <p className="text-sm font-semibold text-foreground">
            {creatorLabel}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Poll info</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{poll.title}</p>
            {poll.description && <p>{poll.description}</p>}
            <p>{poll.questions.length} questions</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
              <User className="w-4 h-4" />
              {liveResponseCount}{" "}
              {liveResponseCount === 1 ? "response" : "responses"}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Current answer</h3>
          <div className="space-y-3 rounded-2xl border border-border bg-background/70 p-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Selected option
              </p>
              <p className="mt-1 font-medium text-foreground">
                {currentSelectionSummary}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Opinion
              </p>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                {opinion.trim() || "No opinion written yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Answered so far</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {answers.length ? (
              answers.map((answer, idx) => {
                const question = poll.questions.find(
                  (q) => q._id === answer.questionId,
                );
                return (
                  <div
                    key={`${answer.questionId}-${idx}`}
                    className="rounded-xl border border-border bg-background/70 p-3 text-sm space-y-1"
                  >
                    <p className="font-medium text-foreground truncate">
                      {question?.text || `Question ${idx + 1}`}
                    </p>
                    <p className="text-muted-foreground">
                      {answer.selectedOption}
                    </p>
                    {answer.opinion ? (
                      <p className="text-xs whitespace-pre-wrap text-muted-foreground">
                        {answer.opinion}
                      </p>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background/70 p-4 text-sm text-muted-foreground">
                Your selected options will appear here.
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="order-1 lg:order-2 flex-1 flex flex-col">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pollProgress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{poll.title}</h2>
              {poll.description && (
                <p className="text-muted-foreground">{poll.description}</p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <User className="w-4 h-4" />
                  {liveResponseCount}{" "}
                  {liveResponseCount === 1 ? "response" : "responses"}
                </div>
              </div>
            </div>

            <div className="mb-8 text-sm font-medium text-muted-foreground tracking-widest uppercase">
              Question {step + 1} of {poll.questions.length}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                  {currentQuestion?.text}
                </h1>

                {!currentQuestion?.allowOpinionText && (
                  <div className="space-y-3">
                    {currentQuestion?.options?.map((opt) => (
                      <button
                        key={opt._id || opt.text}
                        onClick={() => setSelected(opt.text)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 text-lg ${selected === opt.text ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 hover:bg-muted/50 glass"}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span>{opt.text}</span>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === opt.text ? "border-primary" : "border-muted-foreground/30"}`}
                          >
                            {selected === opt.text && (
                              <div className="w-3 h-3 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.allowOpinionText ? (
                  <div className="space-y-4 rounded-2xl border border-border bg-muted/20 p-4">
                    <div>
                      <h3 className="font-semibold">Share your thoughts</h3>
                      <p className="text-xs text-muted-foreground">
                        Full markdown support: **bold**, *italic*, `code`, ###
                        headings, - lists, [links](url), | tables |, and more
                      </p>
                    </div>
                    <Textarea
                      value={opinion}
                      onChange={(e) => setOpinion(e.target.value)}
                      placeholder="Write your response here... (Full markdown supported)"
                      className="min-h-40 bg-background font-mono text-sm"
                    />
                    {opinion.trim() && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Preview:
                        </p>
                        <div className="rounded-lg border border-border/50 bg-background p-4 overflow-auto max-h-64">
                          <div
                            className="prose prose-sm max-w-none dark:prose-invert 
                            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2
                            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2
                            [&_h3]:text-base [&_h3]:font-bold [&_h3]:mb-2
                            [&_h4]:text-sm [&_h4]:font-bold [&_h4]:mb-1
                            [&_p]:my-1 [&_p]:leading-relaxed
                            [&_ul]:ml-4 [&_ul]:my-1 [&_ul]:list-disc
                            [&_ol]:ml-4 [&_ol]:my-1 [&_ol]:list-decimal
                            [&_li]:my-0.5
                            [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                            [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-2
                            [&_pre_code]:text-xs
                            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2
                            [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80
                            [&_strong]:font-bold
                            [&_em]:italic
                            [&_del]:line-through [&_del]:opacity-60
                            [&_table]:border-collapse [&_table]:w-full [&_table]:my-2
                            [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted
                            [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1
                            [&_hr]:my-3 [&_hr]:border-t [&_hr]:border-border
                            [&_img]:max-w-full [&_img]:rounded
                            text-sm"
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkBreaks]}
                              rehypePlugins={[
                                rehypeRaw,
                                [rehypeHighlight, { detect: true }],
                              ]}
                              components={{
                                code: ({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }: any) =>
                                  inline ? (
                                    <code
                                      className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  ) : (
                                    <pre className="bg-muted p-3 rounded overflow-x-auto my-2">
                                      <code
                                        className={className || "text-xs"}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    </pre>
                                  ),
                              }}
                            >
                              {opinion}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="flex justify-end pt-4">
                  <Button
                    size="lg"
                    className="px-8 text-base gap-2"
                    onClick={handleNext}
                    disabled={
                      isSubmitting ||
                      (currentQuestion?.allowOpinionText
                        ? !opinion.trim()
                        : !selected)
                    }
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : step === poll.questions.length - 1
                        ? "Submit"
                        : "Next"}
                    {step !== poll.questions.length - 1 && !isSubmitting && (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
