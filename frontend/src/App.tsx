import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthApi } from "./api";
import NotFound from "./components/Error/NotFound";
import ServerError from "./components/Error/ServerError";
import LinearProgressFallback from "./components/LoadingBar/LinearProgressFallback";
import AdminRoute from "./routes/AdminRoute";
import AuthRoute from "./routes/AuthRoute";
import GuestRoute from "./routes/GuestRoute";
import AdminAnalytics from "./views/Admin/Analytics";
import GptView from "./views/Admin/GptView";
import { GamePage } from "./views/GameScreen/GameScreen";
import Login from "./views/User/LogIn";
import SignUp from "./views/User/SignUp";
import UserView from "./views/User/UserView";
import AvailableTexts from "./views/AvailableTexts/AvailableTexts";

const queryClient = new QueryClient();

// Send cookies with every request
axios.defaults.withCredentials = true;
axios.interceptors.response.use(undefined, (error: AxiosError) => {
  if (
    error.response &&
    [401, 404].includes(error.response.status) &&
    // Prevent infinite loop when refreshing token fails.
    error.config &&
    !error.config.url?.endsWith("/auth/token")
  ) {
    // Update access token and try again.
    const authApi = new AuthApi();
    return authApi
      .getToken()
      .then(() => axios.request(error.config!))
      .catch(() => Promise.reject(error));
  }
  return Promise.reject(error);
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LinearProgressFallback />}>
        <ErrorBoundary fallback={<ServerError />}>
          <BrowserRouter>
            <Routes>
              <Route element={<AuthRoute fallback="/login" />}>
                <Route path="/" element={<Navigate to="/game" />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/user" element={<UserView />} />
                <Route path="/available-texts" element={<AvailableTexts />} />
                <Route path="/gpt" element={<GptView />} />
                <Route element={<AdminRoute fallback="/login" />}>
                  <Route path="/admin" element={<AdminAnalytics />} />
                </Route>
              </Route>
              <Route element={<GuestRoute fallback="/game" />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
