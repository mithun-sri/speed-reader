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
import { TutorialContextProvider } from "./context/TutorialContext";
import { WebGazerProvider } from "./context/WebGazerContext";
import AdminRoute from "./routes/AdminRoute";
import AuthRoute from "./routes/AuthRoute";
import DesktopRoute from "./routes/DesktopRoute";
import GuestRoute from "./routes/GuestRoute";
import MobileRoute from "./routes/MobileRoute";
import AdminAnalytics from "./views/Admin/Analytics";
import GptView from "./views/Admin/GptView";
import AdminQuestionStat from "./views/Admin/QuestionStat";
import QuizAnalytics from "./views/Admin/QuizAnalytics";
import AvailableTexts from "./views/AvailableTexts/AvailableTexts";
import { GamePage } from "./views/GameScreen/GameScreen";
import PrivacyPolicyView from "./views/Policies/PrivacyPolicy";
import TermsOfServiceView from "./views/Policies/TermsOfService";
import HistoricalResultsPage from "./views/Results/HistoricalResultPage";
import Tutorial from "./views/Tutorial/Tutorial";
import Login from "./views/User/LogIn";
import SignUp from "./views/User/SignUp";
import UserView from "./views/User/UserView";
import WebGazerCalibration from "./views/WebGazerCalibration/WebGazerCalibration";
import SummarisedAnalytics from "./views/Admin/SummarisedAnalytics";
import TextForm from "./views/Admin/EditText";

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
              <TutorialContextProvider>
                <WebGazerProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route element={<DesktopRoute fallback="/mobile" />}>
                        <Route
                          path="/privacy-policy"
                          element={<PrivacyPolicyView />}
                        />
                        <Route
                          path="/terms-of-service"
                          element={<TermsOfServiceView />}
                        />
                        <Route element={<CookieConsentHOC />}>
                          <Route element={<AuthRoute fallback="/login" />}>
                            <Route path="/" element={<Navigate to="/game" />} />
                            <Route path="/game" element={<GamePage />} />
                            <Route
                              path="/calibrate"
                              element={<WebGazerCalibration />}
                            />
                            <Route path="/user" element={<UserView />} />
                            <Route
                              path="/user/history/:id"
                              element={<HistoricalResultsPage />}
                            />
                            <Route
                              path="/available-texts/:page?"
                              element={<AvailableTexts />}
                            />
                            <Route element={<AdminRoute fallback="/" />}>
                              <Route path="/gpt" element={<GptView />} />
                              <Route
                                path="/admin"
                                element={<AdminAnalytics />}
                              />
                              <Route
                                path="/admin/questions/:text_id"
                                element={<AdminQuestionStat />}
                              />
                              <Route
                                path="/admin/questions/:text_id/stat/:question_id"
                                element={<QuizAnalytics />}
                              />
                              <Route
                                path="/admin/summarised/:text_id"
                                element={<SummarisedAnalytics />}
                              />
                              <Route
                                path="/admin/text/:text_id/edit"
                                element={<TextForm />}
                              />
                            </Route>
                          </Route>
                          <Route element={<GuestRoute fallback="/" />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                          </Route>
                          <Route path="/tutorial" element={<Tutorial />} />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Route>
                      <Route element={<MobileRoute fallback="/" />}>
                        <Route path="/mobile" element={<NoMobile />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </WebGazerProvider>
              </TutorialContextProvider>
            </SnackContextProvider>
          </QueryClientProvider>
        </ApiClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
