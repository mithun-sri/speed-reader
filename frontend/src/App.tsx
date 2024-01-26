import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
            path="/mode-1-game"
            element={<StandardModeGameView mode={StandardMode.Justified} />}
          />
          <Route path="/mode-2-game" />
          <Route path="/mode-3-game" />
          <Route path="/quiz" element={<QuizView />} />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
  // TODO: Add more Route as more pages are created.
}

export default App;
