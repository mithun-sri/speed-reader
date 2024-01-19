import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import StandardModeGameView from "./views/StandardMode/StandardMode";
import Context from "./Context";

function App() {
  const context = {
    wpm: 300,
  };

  return (
    <Context.Provider value={context}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<ModeSelectView />} /> */}
          <Route path="/mode-1-game" element={<StandardModeGameView />} />
          <Route path="/mode-2-game" />
          <Route path="/mode-3-game" />
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
  // TODO: Add more Route as more pages are created.
}

export default App;
