import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../components/ui/button";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  getPollById,
  submitPollResponse,
  type ApiPoll,
  type PollAnswer,
} from "../../services/pollService";

export default function PublicPoll() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<ApiPoll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<PollAnswer[]>([]);

  useEffect(() => {
    const loadPoll = async () => {
      if (!id) {
        toast.error("Poll not found.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await getPollById(id);
        setPoll(response);
      } catch (error: any) {
        console.error("Error loading poll:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to load poll. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadPoll();
  }, [id]);

  const handleNext = async () => {
    if (!selected) {
      toast.error("Please select an option");
      return;
    }

    const currentQuestion = poll?.questions[step];
    if (!currentQuestion) return;

    // Add answer
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion._id || "",
        selectedOption: selected,
      },
    ];
    setAnswers(newAnswers);

    if (step < (poll?.questions.length || 0) - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      // Submit poll response
      await submitPoll(newAnswers);
    }
  };

  const submitPoll = async (finalAnswers: PollAnswer[]) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await submitPollResponse(id, finalAnswers);
      setSubmitted(true);
      toast.success("Response submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting response:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit response. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Thank you!</h1>
          <p className="text-muted-foreground text-lg">
            Your response has been recorded{" "}
            {poll.isAnonymous ? "anonymously" : ""}.
          </p>

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
    );
  }

  const currentQuestion = poll.questions[step];
  const pollProgress = ((step + 1) / poll.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

              <div className="space-y-3">
                {currentQuestion?.options?.map((opt) => (
                  <button
                    key={opt._id || opt.text}
                    onClick={() => setSelected(opt.text)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 text-lg ${selected === opt.text ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 hover:bg-muted/50 glass"}`}
                  >
                    <div className="flex items-center justify-between">
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

              <div className="flex justify-end pt-4">
                <Button
                  size="lg"
                  className="px-8 text-base gap-2"
                  onClick={handleNext}
                  disabled={!selected || isSubmitting}
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
    </div>
  );
}
