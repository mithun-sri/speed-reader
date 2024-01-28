import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  PATH_ADAPTIVE_MODE,
  PATH_STANDARD_MODE_1,
  PATH_STANDARD_MODE_2,
  PATH_SUMMARISED_ADAPTIVE_MODE,
} from "./common/constants";
import Context from "./Context";
import ModeSelectView from "./views/ModeSelect/ModeSelect";
import PreGameView from "./views/PreGame/PreGame";
import QuizView from "./views/Quiz/Quiz";
import StandardModeGameView, {
  StandardMode,
} from "./views/StandardMode/StandardMode";

function App() {
  const [wpm, setWPM] = useState<number>(300);

  return (
    <Context.Provider value={{ wpm, setWPM }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModeSelectView />} />
          <Route path="/pre-game" element={<PreGameView />} />
          <Route
            path={PATH_STANDARD_MODE_1}
            element={<StandardModeGameView mode={StandardMode.Word} />}
          />
          <Route
            path={PATH_STANDARD_MODE_2}
            element={<StandardModeGameView mode={StandardMode.Justified} />}
          />
          <Route path={PATH_ADAPTIVE_MODE} />
          <Route path={PATH_SUMMARISED_ADAPTIVE_MODE} />
          <Route path="/quiz" element={<QuizView />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
  // TODO: Add more Route as more pages are created.
}

export default App;
