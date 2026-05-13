import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PollFormBuilder from "../../components/polls/PollFormBuilder";
import {
  getPollById,
  publishPollResults,
  updatePoll,
  type PollFormValues,
  type ApiPoll,
} from "../../services/pollService";

const emptyPoll: PollFormValues = {
  title: "",
  description: "",
  isAnonymous: false,
  allowResultsPublish: true,
  expiresAt: "",
  questions: [
    {
      text: "",
      isRequired: true,
      options: [{ text: "" }, { text: "" }],
    },
  ],
};

function pollToFormValues(poll: ApiPoll): PollFormValues {
  return {
    title: poll.title || "",
    description: poll.description || "",
    isAnonymous: poll.isAnonymous || false,
    allowResultsPublish: poll.allowResultsPublish ?? true,
    expiresAt: poll.expiresAt
      ? new Date(poll.expiresAt).toISOString().slice(0, 16)
      : "",
    questions: poll.questions?.length
      ? poll.questions.map((question) => ({
          text: question.text,
          isRequired: question.isRequired,
          options: question.options?.length
            ? question.options.map((option) => ({ text: option.text }))
            : [{ text: "" }, { text: "" }],
        }))
      : emptyPoll.questions,
  };
}

export default function EditPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<PollFormValues>(emptyPoll);
  const [pollStatus, setPollStatus] = useState<ApiPoll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoll = async () => {
      if (!id) {
        toast.error("Poll id is missing.");
        navigate("/app/polls");
        return;
      }

      try {
        setLoading(true);
        const response = await getPollById(id);
        const poll = (response as any).data || response;
        setInitialValues(pollToFormValues(poll));
        setPollStatus(poll);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load poll.";
        toast.error(message);
        navigate("/app/polls");
      } finally {
        setLoading(false);
      }
    };

    void loadPoll();
  }, [id, navigate]);

  const handleSave = async (values: PollFormValues) => {
    if (!id) return;
    const updated = await updatePoll(id, values);
    setPollStatus(updated);
    toast.success("Poll updated successfully.");
    navigate(`/app/polls/${id}`);
  };

  const handlePublish = async (values: PollFormValues) => {
    if (!id) return;
    const updated = await updatePoll(id, values);
    const published = await publishPollResults(id);
    setPollStatus((published as ApiPoll) || updated);
    toast.success("Poll results published successfully.");
    navigate(`/app/polls/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-pulse">
        <div className="h-24 rounded-2xl border border-border bg-muted/20" />
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-4">
            <div className="h-48 rounded-2xl border border-border bg-muted/20" />
            <div className="h-72 rounded-2xl border border-border bg-muted/20" />
          </div>
          <div className="space-y-4">
            <div className="h-56 rounded-2xl border border-border bg-muted/20" />
            <div className="h-36 rounded-2xl border border-border bg-muted/20" />
          </div>
        </div>
      </div>
    );
  }

  if (!id) {
    return null;
  }

  return (
    <PollFormBuilder
      mode="edit"
      initialValues={initialValues}
      initialPublished={pollStatus?.resultsPublished}
      title="Edit Poll"
      subtitle="Refine your questions, update settings, and publish results when ready."
      saveLabel="Save Changes"
      publishLabel="Publish Results"
      onSave={handleSave}
      onPublish={handlePublish}
      onCancel={() => navigate(`/app/polls/${id}`)}
    />
  );
}
