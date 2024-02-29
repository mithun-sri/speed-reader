import axios, { AxiosError } from "axios";
import { ReactNode, useEffect } from "react";
import { AuthApi } from "./api";

// NOTE:
// This provider does not actually create a new Axios instance
// but configures the default instance provided by `axios` module.
// This was necessary to allow easy integration with `openapi-generator` generated API clients.
export function AxiosClientProvider({ children }: { children: ReactNode }) {
  function handleRefreshToken(error: AxiosError) {
    const status = error.response?.status ?? 0;
    const detail = (error.response?.data as any)?.detail ?? "";
    if (
      [401, 404].includes(status) &&
      ["Token not found", "Invalid token"].includes(detail) &&
      // Prevent infinite loop when refreshing token fails.
      error.config &&
      !error.config.url?.endsWith("/auth/token")
    ) {
      console.log("Refreshing token");
      // Update access token and try again.
      const authApi = new AuthApi();
      return authApi
        .getToken()
        .then(() => axios.request(error.config!))
        .catch(() => Promise.reject(error));
    }
    return Promise.reject(error);
  }

  useEffect(() => {
    // Send cookies with every request
    axios.defaults.withCredentials = true;
    const interceptorId = axios.interceptors.response.use(
      undefined,
      handleRefreshToken,
    );

    return () => {
      axios.defaults.withCredentials = false;
      axios.interceptors.response.eject(interceptorId);
    };
  });

  return <>{children}</>;
}
