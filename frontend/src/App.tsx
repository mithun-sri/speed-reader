import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { GameScreen } from "./views/GameScreen/GameScreen";

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/game" />} />
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
