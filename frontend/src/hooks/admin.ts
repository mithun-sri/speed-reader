import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { AdminApi, QuestionWithCorrectOption, Text } from "../api";

const adminApi = new AdminApi();

export function getAdminStatistics(gameMode: string) {
  return useSuspenseQuery({
    queryKey: ["admin-statistics", gameMode],
    queryFn: () =>
      adminApi.getAdminStatistics(gameMode).then((res) => res.data),
    gcTime: 0,
  });
}

// Define the hook function
export function useGenerateText(difficulty: string, isFiction: boolean) {
  return useSuspenseQuery({
    queryKey: ["generate-text"],
    queryFn: () =>
      adminApi.generateText(difficulty, isFiction).then((res) => res.data),
    // NOTE:
    // This disables caching mechanism of react-query temporarily.
    // Comment it out when we have data-fetching logic working.
    gcTime: 0,
  });
}

export function useAddText() {
  return useMutation({
    mutationFn: (text: Text) => adminApi.addText(text),
  });
}

export function useSubmitQuestions() {
  return useMutation({
    mutationFn: submitQuestions,
  });
}

interface SubmitQuestionsParams {
  textId: string;
  questions: QuestionWithCorrectOption[];
}

type SubmitQuestionsResponse = AxiosResponse;

// Define the submitQuestions function
async function submitQuestions({
  textId,
  questions,
}: SubmitQuestionsParams): Promise<SubmitQuestionsResponse> {
  // Call adminApi.submitQuestions and return the response
  return adminApi.submitQuestions(textId, questions);
}
