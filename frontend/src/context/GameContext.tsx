import React, { createContext, useContext, useState } from "react";
import { GameMode } from "../common/constants";

interface GameContextType {
  mode: GameMode | null;
  setMode: (mode: GameMode) => void;
  wpm: number | null;
  setWpm: (wpm: number) => void;
  difficulty: string | null;
  setDifficulty: (difficulty: string) => void;
}

const GameContext = createContext<GameContextType>({
  mode: null,
  setMode: () => {},
  wpm: null,
  setWpm: () => {},
  difficulty: null,
  setDifficulty: () => {},
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
  const [wpm, setWpm] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  return (
    <GameContext.Provider
      value={{ mode, setMode, wpm, setWpm, difficulty, setDifficulty }}
    >
      {children}
    </GameContext.Provider>
  );
};
