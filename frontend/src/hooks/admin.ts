import { useSuspenseQuery } from "@tanstack/react-query";
import { AdminApi } from "../api";

const adminApi = new AdminApi();

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
