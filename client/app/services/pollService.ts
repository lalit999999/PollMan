import apiClient from "./apiClient";

export type PollOptionFormValue = {
  text: string;
};

export type PollQuestionFormValue = {
  text: string;
  isRequired: boolean;
  options: PollOptionFormValue[];
};

export type PollFormValues = {
  title: string;
  description: string;
  isAnonymous: boolean;
  allowResultsPublish: boolean;
  expiresAt: string;
  questions: PollQuestionFormValue[];
};

type ApiPollOption = {
  text: string;
  count?: number;
};

export type ApiPollQuestion = {
  _id?: string;
  text: string;
  isRequired: boolean;
  options: ApiPollOption[];
};

export type ApiPoll = {
  _id: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  allowResultsPublish: boolean;
  resultsPublished?: boolean;
  expiresAt: string | null;
  questions: ApiPollQuestion[];
  createdBy?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

function normalizeQuestions(questions: PollQuestionFormValue[]) {
  return questions.map((question) => ({
    text: question.text.trim(),
    isRequired: question.isRequired,
    options: question.options.map((option) => ({
      text: option.text.trim(),
    })),
  }));
}

export function normalizePollPayload(values: PollFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    isAnonymous: values.isAnonymous,
    allowResultsPublish: values.allowResultsPublish,
    expiresAt: values.expiresAt
      ? new Date(values.expiresAt).toISOString()
      : null,
    questions: normalizeQuestions(values.questions),
  };
}

export async function createPoll(values: PollFormValues) {
  const response = await apiClient.post<ApiResponse<ApiPoll>>(
    "/polls",
    normalizePollPayload(values),
  );
  return response.data;
}

export async function getPollById(pollId: string) {
  const response = await apiClient.get<ApiResponse<ApiPoll>>(
    `/polls/${pollId}`,
  );
  return response.data;
}

export async function updatePoll(pollId: string, values: PollFormValues) {
  const response = await apiClient.patch<ApiResponse<ApiPoll>>(
    `/polls/${pollId}`,
    normalizePollPayload(values),
  );
  return response.data;
}

export async function publishPollResults(pollId: string) {
  const response = await apiClient.post<ApiResponse<ApiPoll>>(
    `/polls/${pollId}/publish`,
  );
  return response.data;
}
