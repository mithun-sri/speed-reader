import React, { createContext, useContext, useState } from "react";
import { GameDifficulty, GameMode } from "../common/constants";
import { StandardView } from "../views/StandardMode/StandardMode";

interface GameContextType {
  mode: GameMode | null;
  setMode: (mode: GameMode) => void;
  difficulty: GameDifficulty | null;
  setDifficulty: (difficulty: GameDifficulty | null) => void;
  wpm: number | null;
  setWpm: (wpm: number) => void;
  view: StandardView | null; // TODO: change to GameView when StandardSelect is implemented
  setView: (view: StandardView) => void;
  gazeX: number;
  setGazeX: (x: number) => void;
  gazeY: number;
  setGazeY: (y: number) => void;
}

const GameContext = createContext<GameContextType>({
  mode: null,
  setMode: () => {},
  difficulty: null,
  setDifficulty: () => {},

  // wpm and view are only for STANDARD_MODE
  wpm: null,
  setWpm: () => {},
  view: null,
  setView: () => {},

  // gaze_x and gaze_y are only for ADAPTIVE_MODE
  gazeX: 0,
  setGazeX: () => {},
  gazeY: 0,
  setGazeY: () => {},
});

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error(
      "useGameContext must be used within a GameContext.Provider",
    );
  }
  return context;
};

// This provides the game context, which manages
// the state related to the game mode, words per minute (WPM), and difficulty level.
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [view, setView] = useState<StandardView | null>(null);
  const [gazeX, setGazeX] = useState<number>(0);
  const [gazeY, setGazeY] = useState<number>(0);

  return (
    <GameContext.Provider
      value={{
        mode,
        setMode,
        difficulty,
        setDifficulty,
        wpm,
        setWpm,
        view,
        setView,
        gazeX,
        setGazeX,
        gazeY,
        setGazeY,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
