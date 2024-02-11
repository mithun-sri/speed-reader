import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WebGazerLoader from "./views/Calibration/WebGazerLoader";
import { GamePage } from "./views/GameScreen/GameScreen";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/game" />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/calibration" element={<WebGazerLoader />} />
              <Route path="/user" />
              <Route path="/admin" />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
