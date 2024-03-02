import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BodyLoginUser, BodyRegisterUser } from "../api";
import { useApiClient } from "../context/ApiContext";

export function useAuth() {
  const { userApi } = useApiClient();

  const { data: user } = useSuspenseQuery({
    queryKey: ["users", "current"],
    queryFn: () =>
      userApi
        .getCurrentUser()
        .then((res) => res.data)
        .catch((error: AxiosError) => {
          console.log("Intercepted error from users");
          // TODO: Extract duplicate code with axios interceptors.
          const status = error.response?.status ?? 0;
          const detail = (error.response?.data as any)?.detail ?? "";
          if (
            [401, 404].includes(status) &&
            ["Token not found", "Invalid token"].includes(detail)
          ) {
            return Promise.resolve(null);
          }
          return Promise.reject(error);
        }),
    // NOTE:
    // Do not retry on error otherwise it takes a long time
    // to detect that the user is not logged in.
    retry: false,
    // Checking login status every 10 minutes.
    refetchInterval: 10 * 60 * 1000,
    // Do not cache login status.
    gcTime: 0,
  });

  const isGuest = user === null;
  const isAuth = !isGuest;
  const isAdmin = isAuth && user.role === "admin";
  const isUser = isAuth && user.role === "user";

  return {
    isGuest,
    isAuth,
    isAdmin,
    isUser,
  };
}

export function useRegisterUser() {
  const { userApi } = useApiClient();

  return useMutation({
    mutationFn: (data: BodyRegisterUser) => userApi.registerUser(data),
  });
}

export function useLoginUser() {
  const { userApi } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BodyLoginUser) => userApi.loginUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "current"],
      });
    },
  });
}

export function useLogoutUser() {
  const { userApi } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.logoutUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "current"],
      });
    },
  });
}

export function getCurrentUser() {
  const { userApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getCurrentUser().then((res) => res.data),
    gcTime: 0,
  });
}

export function getUserStatistics(mode: string) {
  const { userApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["users", "statistics", mode],
    queryFn: () => userApi.getUserStatistics(mode).then((res) => res.data),
    gcTime: 0,
  });
}

export function getHistories() {
  const { userApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["users", "histories"],
    queryFn: () => userApi.getHistories().then((res) => res.data),
    gcTime: 0,
  });
}

export function getHistory(historyId: string) {
  const { userApi } = useApiClient();

  return useSuspenseQuery({
    queryKey: ["users", "history", historyId],
    queryFn: () => userApi.getHistory(historyId).then((res) => res.data),
    gcTime: 0,
  });
}
