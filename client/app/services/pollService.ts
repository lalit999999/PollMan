import apiClient from "./apiClient";

export type PollOptionFormValue = {
  text: string;
};

export type PollQuestionFormValue = {
  text: string;
  isRequired: boolean;
  allowOpinionText: boolean;
  options: PollOptionFormValue[];
};

export type PollFormValues = {
  title: string;
  description: string;
  isAnonymous: boolean;
  allowResultsPublish: boolean;
  expiresAt: string;
  questions: PollQuestionFormValue[];
  passwordProtected?: boolean;
  password?: string | null;
  isResponseLimited?: boolean;
  responseLimit?: number | null;
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
  allowOpinionText?: boolean;
  voteCount?: number;
  options: ApiPollOption[];
};

export type ApiPoll = {
  _id: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  allowResultsPublish: boolean;
  allowOpinionText?: boolean;
  passwordProtected?: boolean;
  isResponseLimited?: boolean;
  responseLimit?: number | null;
  resultsPublished?: boolean;
  totalResponses?: number;
  status?: string;
  isPublished?: boolean;
  expiresAt: string | null;
  createdAt?: string;
  questions: ApiPollQuestion[];
  createdBy?: string | { _id: string; name: string; email?: string };
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
    allowOpinionText: question.allowOpinionText,
    options: question.allowOpinionText
      ? [{ text: "Opinion" }, { text: "Opinion" }] // Placeholder options for opinion-only questions
      : question.options.map((option) => ({
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
    passwordProtected: !!values.passwordProtected,
    password: values.password
      ? String(values.password).toUpperCase()
      : undefined,
    isResponseLimited: !!values.isResponseLimited,
    responseLimit: values.isResponseLimited
      ? Number(values.responseLimit) || null
      : null,
    expiresAt: values.expiresAt
      ? new Date(values.expiresAt).toISOString()
      : null,
    questions: normalizeQuestions(values.questions),
  };
}

export async function createPoll(values: PollFormValues) {
  const { data: poll } = await apiClient.post<ApiResponse<ApiPoll>>(
    "/polls",
    normalizePollPayload(values),
  );
  return poll;
}

export async function getPollById(pollId: string) {
  const { data: poll } = await apiClient.get<ApiResponse<ApiPoll>>(
    `/polls/${pollId}`,
  );
  return poll;
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

  const { data: pollsData } = await apiClient.get<
    ApiResponse<{
      polls: ApiPoll[];
      total: number;
      page: number;
      pages: number;
    }>
  >(`/polls?${params.toString()}`);
  return pollsData;
}

export async function updatePoll(pollId: string, values: PollFormValues) {
  const { data: poll } = await apiClient.patch<ApiResponse<ApiPoll>>(
    `/polls/${pollId}`,
    normalizePollPayload(values),
  );
  return poll;
}

export async function publishPollResults(pollId: string) {
  const { data: poll } = await apiClient.post<ApiResponse<ApiPoll>>(
    `/polls/${pollId}/publish`,
  );
  return poll;
}

export async function publishPoll(pollId: string) {
  const { data: poll } = await apiClient.post<ApiResponse<ApiPoll>>(
    `/polls/${pollId}/go-live`,
  );
  return poll;
}

export async function getPublicResults(pollId: string) {
  const { data: results } = await apiClient.get<
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
  return results;
}

export async function getDashboardOverview() {
  const { data: overview } = await apiClient.get<
    ApiResponse<{
      stats: {
        totalPolls: number;
        totalResponses: number;
        activePolls: number;
        draftPolls: number;
      };
      activityTimeline: Array<{
        name: string;
        responses: number;
      }>;
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

  return overview;
}

export async function getPollAnalytics(pollId: string) {
  const { data: analytics } = await apiClient.get<ApiResponse<any>>(
    `/polls/${pollId}/analytics`,
  );
  return analytics;
}

export async function deletePoll(pollId: string) {
  const { data: result } = await apiClient.delete<
    ApiResponse<{ message: string }>
  >(`/polls/${pollId}`);
  return result;
}

export type PollAnswer = {
  questionId: string;
  selectedOption: string | null;
  opinion?: string;
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
export async function verifyPollPassword(pollId: string, password?: string) {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    `/polls/${pollId}/verify-password`,
    { password: password ? password.toUpperCase() : password },
    { skipAuth: true },
  );

  return response.data;
}
