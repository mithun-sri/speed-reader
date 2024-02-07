import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GamePage } from "./views/GameScreen/GameScreen";
import UserView from "./views/User/UserView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/game" />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/user" element={<UserView />} />
        <Route path="/admin" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
