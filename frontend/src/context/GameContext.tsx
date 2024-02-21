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
  averageWpm: number;
  setAverageWpm: (averageWpm: number) => void;
  intervalWpms: number[];
  setIntervalWpms: (intervalWpms: number[]) => void;
  gazeX: number;
  setGazeX: (x: number) => void;
  gazeY: number;
  setGazeY: (y: number) => void;
  textId: string;
  setTextId: (textid: string) => void;
  quizAnswers: (number | null)[];
  setQuizAnswers: (answers: (number | null)[]) => void;
  modifyQuizAnswer: (index: number, answer: number | null) => void;
}

const GameContext = createContext<GameContextType>({
  mode: null,
  setMode: () => {},
  difficulty: null,
  setDifficulty: () => {},

  // wpm and view are only for STANDARD_MODE
  wpm: 400,
  setWpm: () => {},
  view: null,
  setView: () => {},

  // store wpm per five seconds
  averageWpm: 0,
  setAverageWpm: () => {},
  // store wpm average for a game after a game ends
  intervalWpms: [],
  setIntervalWpms: () => {},
  // gaze_x and gaze_y are only for ADAPTIVE_MODE
  gazeX: 0,
  setGazeX: () => {},
  gazeY: 0,
  setGazeY: () => {},

  textId: "",
  setTextId: () => {},

  quizAnswers: [],
  setQuizAnswers: () => {},
  modifyQuizAnswer: () => {},
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
  const [wpm, setWpm] = useState<number | null>(400);
  const [view, setView] = useState<StandardView | null>(null);
  const [averageWpm, setAverageWpm] = useState<number>(0);
  const [intervalWpms, setIntervalWpms] = useState<number[]>([]);
  const [gazeX, setGazeX] = useState<number>(0);
  const [gazeY, setGazeY] = useState<number>(0);
  const [textId, setTextId] = useState<string>("");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);

  const modifyQuizAnswer = (index: number, answer: number | null) => {
    setQuizAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      if (index >= 0 && index < newAnswers.length) {
        newAnswers[index] = answer;
      }
      return newAnswers;
    });
  };

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
        averageWpm,
        setAverageWpm,
        intervalWpms,
        setIntervalWpms,
        gazeX,
        setGazeX,
        gazeY,
        setGazeY,
        textId,
        setTextId,
        quizAnswers,
        setQuizAnswers,
        modifyQuizAnswer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
