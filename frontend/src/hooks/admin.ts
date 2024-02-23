import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { AdminApi, TextCreateWithQuestions } from "../api";

const adminApi = new AdminApi();

export function getAdminStatistics(gameMode: string) {
  return useSuspenseQuery({
    queryKey: ["admin-statistics", gameMode],
    queryFn: () =>
      adminApi.getAdminStatistics(gameMode).then((res) => res.data),
    gcTime: 0,
  });
}

export function getQuestion(textId: string, questionId: string) {
  return useSuspenseQuery({
    queryKey: ["question-statistics", textId, questionId],
    queryFn: () =>
      adminApi.getQuestion(textId, questionId).then((res) => res.data),
    gcTime: 0,
  });
}

// Define the hook function
export function useGenerateText(difficulty: string, isFiction: boolean) {
  return useSuspenseQuery({
    queryKey: ["generate-text"],
    queryFn: () =>
      adminApi
        .generateText(difficulty, isFiction)
        .then((res: AxiosResponse) => res.data),
    // NOTE:
    // This disables caching mechanism of react-query temporarily.
    // Comment it out when we have data-fetching logic working.
    gcTime: 0,
  });
}

export function useApproveText() {
  return useMutation({
    mutationFn: (text: TextCreateWithQuestions) => adminApi.approveText(text),
  });
}
