import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  PATH_ADAPTIVE_MODE,
  PATH_STANDARD_MODE_1,
  PATH_STANDARD_MODE_2,
  PATH_SUMMARISED_ADAPTIVE_MODE,
} from "./common/constants";
import { GameProvider } from "./context/GameContext";
import WebGazerLoader from "./views/Calibration/WebGazerLoader";
import { GameScreen } from "./views/GameScreen/GameScreen";
import PreGameView from "./views/PreGame/PreGame";
import QuizView from "./views/Quiz/Quiz";
import StandardModeGameView, {
  StandardView,
} from "./views/StandardMode/StandardMode";

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/game" />} />
          <Route path="/calibration" element={<WebGazerLoader />} />
          <Route path="/pre-game" element={<PreGameView />} />
          <Route
            path={PATH_STANDARD_MODE_1}
            element={<StandardModeGameView mode={StandardView.Word} />}
          />
          <Route
            path={PATH_STANDARD_MODE_2}
            element={<StandardModeGameView mode={StandardView.Peripheral} />}
          />
          <Route path={PATH_ADAPTIVE_MODE} />
          <Route path={PATH_SUMMARISED_ADAPTIVE_MODE} />
          <Route path="/quiz" element={<QuizView />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/user" />
          <Route path="/admin" />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
  // TODO: Add more Route as more pages are created.
}

export default App;
