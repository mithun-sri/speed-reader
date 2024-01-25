import { BrowserRouter, Routes, Route } from "react-router-dom";
import StandardModeGameView, {StandardMode} from "./views/StandardMode/StandardMode";
import PreGameView from "./views/PreGame/PreGame";
import QuizView from "./views/Quiz/Quiz";
import Context from "./Context";
import { useState } from "react";
import ModeSelectView from "./views/ModeSelect/ModeSelect";

function App() {
  const [wpm, setWPM] = useState<number>(300);

  return (
    <Context.Provider value={{ wpm, setWPM }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModeSelectView />} />
          <Route path="/pre-game" element={<PreGameView />} />
          <Route path="/mode-1-game" element={<StandardModeGameView mode={StandardMode.Justified} />} />
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
