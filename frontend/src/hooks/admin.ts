import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { TextCreateWithQuestions } from "../api";
import { useApiClient } from "../context/ApiContext";

export function getAdminStatistics(gameMode: string) {
  const { adminApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["admin-statistics", gameMode],
    queryFn: () =>
      adminApi.getAdminStatistics(gameMode).then((res) => res.data),
    gcTime: 0,
  });
}

export function getText(text_id: string) {
  const { adminApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["text-statistics"],
    queryFn: () => adminApi.getText(text_id).then((res) => res.data),
    gcTime: 0,
  });
}

export function getTexts(page?: number, pageSize?: number) {
  const { adminApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["texts-statistics"],
    queryFn: () => adminApi.getTexts(page, pageSize).then((res) => res.data),
    gcTime: 0,
  });
}

export function getQuestion(textId: string, questionId: string) {
  const { adminApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["question-statistics", textId, questionId],
    queryFn: () =>
      adminApi.getQuestion(textId, questionId).then((res) => res.data),
    gcTime: 0,
  });
}

export function getQuestions(textId: string) {
  const { adminApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["questions-statistics", textId],
    queryFn: () => adminApi.getQuestions(textId).then((res) => res.data),
    gcTime: 0,
  });
}

// Define the hook function
export function useGenerateText() {
  const { adminApi } = useApiClient();

  return useMutation({
    mutationFn: ({
      difficulty,
      isFiction,
    }: {
      difficulty: string;
      isFiction: boolean;
    }) => adminApi.generateText(difficulty, isFiction).then((res) => res.data),
  });
}

export function useApproveText() {
  const { adminApi } = useApiClient();

  return useMutation({
    mutationFn: (text: TextCreateWithQuestions) => adminApi.approveText(text),
  });
}

export function getTextStatistics(text_id: string) {
  const { adminApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["text-statistics"],
    queryFn: () => adminApi.getSummaryStatistics(text_id).then((res) => res.data),
    gcTime: 0,
  });
}
