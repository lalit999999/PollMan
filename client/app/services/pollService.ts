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
  _id?: string;
  text: string;
  count?: number;
};

export type ApiPollQuestion = {
  _id?: string;
  text: string;
  isRequired: boolean;
  voteCount?: number;
  options: ApiPollOption[];
};

export type ApiPoll = {
  _id: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  allowResultsPublish: boolean;
  resultsPublished?: boolean;
  totalResponses?: number;
  status?: string;
  isPublished?: boolean;
  expiresAt: string | null;
  createdAt?: string;
  questions: ApiPollQuestion[];
  createdBy?: string;
};

export type PublicResultsQuestion = {
  _id: string;
  text: string;
  options: Array<{
    text: string;
    count: number;
    percentage: number;
  }>;
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

export async function getMyPolls(filters?: {
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
  }

  const response = await apiClient.get<
    ApiResponse<{
      polls: ApiPoll[];
      total: number;
      page: number;
      pages: number;
    }>
  >(`/polls?${params.toString()}`);
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

export async function publishPoll(pollId: string) {
  const response = await apiClient.post<ApiResponse<ApiPoll>>(
    `/polls/${pollId}/go-live`,
  );
  return response.data;
}

export async function getPublicResults(pollId: string) {
  const response = await apiClient.get<
    ApiResponse<{
      pollId: string;
      title: string;
      description: string;
      totalResponses: number;
      isExpired: boolean;
      expiresAt: string | null;
      questions: PublicResultsQuestion[];
    }>
  >(`/polls/${pollId}/results`, {
    skipAuth: true,
  });
  return response.data;
}

export async function getDashboardOverview() {
  const response = await apiClient.get<
    ApiResponse<{
      stats: {
        totalPolls: number;
        totalResponses: number;
        activePolls: number;
        draftPolls: number;
      };
      recentPolls: ApiPoll[];
      recentActivity: Array<{
        _id: string;
        action: string;
        metadata: any;
        createdAt: string;
        pollId: string;
        userId: string | null;
      }>;
    }>
  >("/polls/summary");

  return response.data;
}

export async function getPollAnalytics(pollId: string) {
  const response = await apiClient.get<ApiResponse<any>>(
    `/polls/${pollId}/analytics`,
  );
  return response.data;
}

export async function deletePoll(pollId: string) {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/polls/${pollId}`,
  );
  return response.data;
}

export type PollAnswer = {
  questionId: string;
  selectedOption: string;
};

export async function submitPollResponse(
  pollId: string,
  answers: PollAnswer[],
) {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    `/polls/${pollId}/respond`,
    { answers },
  );
  return response.data;
}
