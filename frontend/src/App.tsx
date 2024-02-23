import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthApi } from "./api";
import GptView from "./views/Admin/GptView";
import { GamePage } from "./views/GameScreen/GameScreen";
import UserView from "./views/User/UserView";
import AdminAnalytics from "./views/Admin/Analytics";
import LinearProgressFallback from "./components/LoadingBar/LinearProgressFallback";

const queryClient = new QueryClient();

// Send cookies with every request
axios.defaults.withCredentials = true;
axios.interceptors.response.use(undefined, async (error) => {
  const status = error.response?.status;
  if (status === 401) {
    // Update access token and try again.
    const authApi = new AuthApi();
    await authApi.getToken();
    return axios.request(error.config);
  }
  return Promise.reject(error);
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LinearProgressFallback/>}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/game" />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/user" element={<UserView />} />
              <Route path="/admin" element={<AdminAnalytics />} />
              <Route path="/gpt" element={<GptView />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
