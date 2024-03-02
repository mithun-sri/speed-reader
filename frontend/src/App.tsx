import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CookieConsentHOC from "./components/CookieConsent/CookieConsent";
import NoMobile from "./components/Error/NoMobile";
import NotFound from "./components/Error/NotFound";
import ServerError from "./components/Error/ServerError";
import LinearProgressFallback from "./components/LoadingBar/LinearProgressFallback";
import { ApiClientProvider } from "./context/ApiContext";
import { SnackContextProvider } from "./context/SnackContext";
import { WebGazerProvider } from "./context/WebGazerContext";
import AdminRoute from "./routes/AdminRoute";
import AuthRoute from "./routes/AuthRoute";
import DesktopRoute from "./routes/DesktopRoute";
import GuestRoute from "./routes/GuestRoute";
import MobileRoute from "./routes/MobileRoute";
import AdminAnalytics from "./views/Admin/Analytics";
import GptView from "./views/Admin/GptView";
import AvailableTexts from "./views/AvailableTexts/AvailableTexts";
import { GamePage } from "./views/GameScreen/GameScreen";
import Tutorial from "./views/Tutorial/Tutorial";
import Login from "./views/User/LogIn";
import SignUp from "./views/User/SignUp";
import UserView from "./views/User/UserView";
import WebGazerCalibration from "./views/WebGazerCalibration/WebGazerCalibration";
import HistoricalResultsPage from "./views/Results/HistoricalResultPage";

function App() {
  const queryClient = new QueryClient();

  return (
    // TODO:
    // Refactor deep nested tree of context providers:
    // https://alexkorep.com/react/react-many-context-providers-tree/
    <Suspense fallback={<LinearProgressFallback />}>
      <ErrorBoundary FallbackComponent={ServerError}>
        <ApiClientProvider>
          <QueryClientProvider client={queryClient}>
            <SnackContextProvider>
              <WebGazerProvider>
                <BrowserRouter>
                  <Routes>
                    <Route element={<DesktopRoute fallback="/mobile" />}>
                      <Route element={<CookieConsentHOC />}>
                        <Route element={<AuthRoute fallback="/tutorial" />}>
                          <Route path="/" element={<Navigate to="/game" />} />
                          <Route path="/game" element={<GamePage />} />
                          <Route
                            path="/calibrate"
                            element={<WebGazerCalibration />}
                          />
                          <Route path="/user" element={<UserView />} />
                          <Route
                          path="/user/history/:text_id"
                          element={<HistoricalResultsPage />}
                          />
                          <Route
                            path="/available-texts"
                            element={<AvailableTexts />}
                          />
                          <Route path="/gpt" element={<GptView />} />
                          <Route element={<AdminRoute fallback="/login" />}>
                            <Route path="/admin" element={<AdminAnalytics />} />
                          </Route>
                        </Route>
                        <Route element={<GuestRoute fallback="/game" />}>
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/tutorial" element={<Tutorial />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Route>
                    <Route element={<MobileRoute fallback="/" />}>
                      <Route path="/mobile" element={<NoMobile />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </WebGazerProvider>
            </SnackContextProvider>
          </QueryClientProvider>
        </ApiClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
