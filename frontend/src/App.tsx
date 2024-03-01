import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AxiosClientProvider } from "./axios";
import NotFound from "./components/Error/NotFound";
import ServerError from "./components/Error/ServerError";
import LinearProgressFallback from "./components/LoadingBar/LinearProgressFallback";
import { SnackContextProvider } from "./context/SnackContext";
import AdminRoute from "./routes/AdminRoute";
import AuthRoute from "./routes/AuthRoute";
import GuestRoute from "./routes/GuestRoute";
import AdminAnalytics from "./views/Admin/Analytics";
import GptView from "./views/Admin/GptView";
import { GamePage } from "./views/GameScreen/GameScreen";
import Login from "./views/User/LogIn";
import SignUp from "./views/User/SignUp";
import UserView from "./views/User/UserView";
import Intro from "./views/Intro/Intro";

function App() {
  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<LinearProgressFallback />}>
      <ErrorBoundary FallbackComponent={ServerError}>
        <SnackContextProvider>
          <AxiosClientProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Routes>
                  <Route element={<AuthRoute fallback="/login" />}>
                    <Route path="/" element={<Navigate to="/game" />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/user" element={<UserView />} />
                    <Route path="/gpt" element={<GptView />} />
                    <Route element={<AdminRoute fallback="/login" />}>
                      <Route path="/admin" element={<AdminAnalytics />} />
                    </Route>
                  </Route>
                  <Route element={<GuestRoute fallback="/game" />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/intro" element={<Intro />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </QueryClientProvider>
          </AxiosClientProvider>
        </SnackContextProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
