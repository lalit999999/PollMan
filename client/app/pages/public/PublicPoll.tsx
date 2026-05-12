import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function PublicPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const questions = [
    {
      id: 1,
      text: "Which feature should we prioritize for Q1?",
      options: ["Dark Mode", "AI Features", "Performance", "Integrations"],
    },
    {
      id: 2,
      text: "How satisfied are you with the current UI?",
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    },
  ];

  const handleNext = () => {
    if (!selected) {
      toast.error("Please select an option");
      return;
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      setSubmitted(true);
      toast.success("Response submitted successfully!");
    }
  };

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
            Your response has been recorded anonymously.
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

  const currentQ = questions[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-sm font-medium text-muted-foreground tracking-widest uppercase">
            Question {step + 1} of {questions.length}
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
                {currentQ.text}
              </h1>

              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 text-lg ${selected === opt ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 hover:bg-muted/50 glass"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === opt ? "border-primary" : "border-muted-foreground/30"}`}
                      >
                        {selected === opt && (
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
                  disabled={!selected}
                >
                  {step === questions.length - 1 ? "Submit" : "Next"}
                  {step !== questions.length - 1 && (
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
