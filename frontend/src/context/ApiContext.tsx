import axios, { AxiosError } from "axios";
import { ReactNode, createContext, useContext } from "react";
import { AdminApi, AuthApi, GameApi, UserApi } from "../api";

interface ApiContextType {
  authApi: AuthApi;
  userApi: UserApi;
  adminApi: AdminApi;
  gameApi: GameApi;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function useApiClient() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiClient must be used within a ApiClientProvider");
  }
  return context;
}

export function ApiClientProvider({ children }: { children: ReactNode }) {
  const axiosInstance = axios.create();

  // Send cookies with every request.
  axiosInstance.defaults.withCredentials = true;
  // Automatically refresh access token if it's expired.
  axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const detail = (error.response?.data as any)?.detail ?? "";
    if (
      [401, 404].includes(status) &&
      ["Token not found", "Invalid token"].includes(detail)
    ) {
      console.log("Refreshing token...");
      // Update access token and try again.
      // NOTE:
      // This uses the fresh global instance of axios to prevent calling interceptors
      // in an infinite recurisve loop.
      const authApi = new AuthApi();
      return authApi
        .getToken()
        .then(() => axios.request(error.config!))
        .catch(() => Promise.reject(error));
    }
    return Promise.reject(error);
  });

  const authApi = new AuthApi(undefined, undefined, axiosInstance);
  const userApi = new UserApi(undefined, undefined, axiosInstance);
  const adminApi = new AdminApi(undefined, undefined, axiosInstance);
  const gameApi = new GameApi(undefined, undefined, axiosInstance);

  return (
    <ApiContext.Provider value={{ authApi, userApi, adminApi, gameApi }}>
      {children}
    </ApiContext.Provider>
  );
}
