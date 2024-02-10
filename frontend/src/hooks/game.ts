import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BodyPostAnswers, GameApi } from "../api";

const gameApi = new GameApi();

export function useNextText() {
  return useSuspenseQuery({
    queryKey: ["next-text"],
    queryFn: () => gameApi.getNextText().then((res) => res.data),
    // NOTE:
    // This disables caching mechanism of react-query temporarily.
    // Comment it out when we have data-fetching logic working.
    gcTime: 0,
  });
}

export function useNextQuestions(textId: string) {
  return useSuspenseQuery({
    queryKey: ["next-questions"],
    queryFn: () => gameApi.getNextQuestions(textId).then((res) => res.data),
    gcTime: 0,
  });
}

export function usePostAnswers(textId: string) {
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
