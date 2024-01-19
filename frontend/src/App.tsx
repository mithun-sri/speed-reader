import { BrowserRouter, Routes, Route } from "react-router-dom";
import StandardModeGameView from "./views/StandardMode/StandardMode";
import PreGameView from "./views/PreGame/PreGame";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<ModeSelectView />} /> */}
          <Route path="/pre-game" element={<PreGameView />} />
          <Route path="/mode-1-game" element={<StandardModeGameView />} />
          <Route path="/mode-2-game" />
          <Route path="/mode-3-game" />
        </Routes>
      </BrowserRouter>
    </div>
  );
  // TODO: Add more Route as more pages are created.
}

export default App;
