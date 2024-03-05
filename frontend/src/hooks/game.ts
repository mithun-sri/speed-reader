import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BodyPostAnswers } from "../api";
import { useApiClient } from "../context/ApiContext";

export function useNextText(
  isSummary: boolean,
  difficulty: string | undefined,
) {
  const { gameApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["next-text"],
    queryFn: () =>
      // NOTE:
      // `openapi-generator` cannot handle optional type correctly for difficulty.
      // We need to cast it to `any` to avoid TypeScript error.
      gameApi.getNextText(isSummary, difficulty).then((res) => res.data),
    // NOTE:
    // This disables caching mechanism of react-query temporarily.
    // Comment it out when we have data-fetching logic working.
    gcTime: 0,
  });
}

export function useNextTextById(textId: string) {
  const { gameApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["next-text"],
    queryFn: () => gameApi.getTextById(textId).then((res) => res.data),
    gcTime: 0,
  });
}

export function useNextQuestions(textId: string) {
  const { gameApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["next-questions"],
    queryFn: () => gameApi.getNextQuestions(textId).then((res) => res.data),
    gcTime: 0,
  });
}

export function usePostAnswers(textId: string) {
  const { gameApi } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BodyPostAnswers) => gameApi.postAnswers(textId, data),
    onSuccess: () => {
      // NOTE:
      // These lines have no effect as we disable caching mechanism for each query.
      // Comment them out when we have caching mechanism ready.
      queryClient.invalidateQueries({
        queryKey: ["next-text"],
      });
      queryClient.invalidateQueries({
        queryKey: ["next-questions"],
      });
    },
  });
}
