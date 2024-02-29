import React, { createContext, useContext, useState } from "react";
import { QuestionMasked } from "../api";
import { GameDifficulty, GameMode } from "../common/constants";
import { StandardView } from "../views/StandardMode/StandardMode";

interface GameContextType {
  mode: GameMode | null;
  setMode: (mode: GameMode) => void;
  summarised: boolean;
  setSummarised: (summarised: boolean) => void;
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
  textId: string;
  setTextId: (textid: string) => void;
  quizAnswers: (number | null)[];
  setQuizAnswers: (answers: (number | null)[]) => void;
  quizResults: any;
  setQuizResults: (results: any) => void;
  modifyQuizAnswer: (index: number, answer: number | null) => void;
  quizContent: QuestionMasked[] | null;
  setQuizContent: (questionMasked: QuestionMasked[]) => void;
}

const GameContext = createContext<GameContextType>({
  mode: null,
  setMode: () => {},
  summarised: false,
  setSummarised: () => {},
  difficulty: null,
  setDifficulty: () => {},

  // wpm and view are only for STANDARD_MODE
  wpm: 200,
  setWpm: () => {},
  view: null,
  setView: () => {},

  // store wpm per five seconds
  averageWpm: 0,
  setAverageWpm: () => {},
  // store wpm average for a game after a game ends
  intervalWpms: [],
  setIntervalWpms: () => {},

  textId: "",
  setTextId: () => {},

  quizAnswers: [],
  setQuizAnswers: () => {},
  quizResults: [],
  setQuizResults: () => {},
  modifyQuizAnswer: () => {},

  // Question Content and Options
  quizContent: null,
  setQuizContent: () => {},
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
  const [summarised, setSummarised] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);
  const [wpm, setWpm] = useState<number | null>(200);
  const [view, setView] = useState<StandardView | null>(null);
  const [averageWpm, setAverageWpm] = useState<number>(0);
  const [intervalWpms, setIntervalWpms] = useState<number[]>([]);
  const [textId, setTextId] = useState<string>("");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizResults, setQuizResults] = useState<any>([]);
  const [quizContent, setQuizContent] = useState<QuestionMasked[] | null>([]);

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
        summarised,
        setSummarised,
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
        textId,
        setTextId,
        quizAnswers,
        setQuizAnswers,
        quizResults,
        setQuizResults,
        modifyQuizAnswer,
        quizContent,
        setQuizContent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
