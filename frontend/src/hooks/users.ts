import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BodyLoginUser, BodyRegisterUser, UserApi } from "../api";

const userApi = new UserApi();

export function useAuth() {
  const { data: user } = useSuspenseQuery({
    queryKey: ["users", "current"],
    queryFn: () =>
      userApi
        .getCurrentUser()
        .then((res) => res.data)
        .catch((error) => {
          if (error.status === 401 || error.status === 404)
            return Promise.resolve(null);
          return Promise.reject(error);
        }),
    // Checking login status every 10 minutes.
    refetchInterval: 10 * 60 * 1000,
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
  return useMutation({
    mutationFn: (data: BodyRegisterUser) => userApi.registerUser(data),
  });
}

export function useLoginUser() {
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
