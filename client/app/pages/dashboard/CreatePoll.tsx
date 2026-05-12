import { useNavigate } from "react-router";
import PollFormBuilder from "../../components/polls/PollFormBuilder";
import {
  createPoll,
  publishPollResults,
  type PollFormValues,
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

export default function CreatePoll() {
  const navigate = useNavigate();

  const handleSave = async (values: PollFormValues) => {
    const created = await createPoll(values);
    navigate(`/app/polls/${created._id}`);
  };

  const handlePublish = async (values: PollFormValues) => {
    const created = await createPoll(values);
    await publishPollResults(created._id);
    navigate(`/app/polls/${created._id}`);
  };

  return (
    <PollFormBuilder
      mode="create"
      initialValues={emptyPoll}
      title="Create Poll"
      subtitle="Design a premium single-choice poll with dynamic questions, expiry controls, and publishing settings."
      onSave={handleSave}
      onPublish={handlePublish}
      onCancel={() => navigate(-1)}
    />
  );
}
