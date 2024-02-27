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
  webGazerInitialised: boolean;
  setwebGazerInitialised: (webGazerInitialised: boolean) => void;
  initialiseWebGazer: () => void;
  endWebGazer: () => void;
  restartWebGazer: () => void;
  turnOffWebGazerCam: () => void;
  gazeX: number;
  setGazeX: (x: number) => void;
  gazeY: number;
  setGazeY: (y: number) => void;
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

  // used for webgazer initialisation and maintaining state
  webGazerInitialised: false,
  setwebGazerInitialised: () => {},
  initialiseWebGazer: () => {},
  endWebGazer: () => {},
  restartWebGazer: () => {},
  turnOffWebGazerCam: () => {},

  // gaze_x and gaze_y are only for ADAPTIVE_MODE
  gazeX: 0,
  setGazeX: () => {},
  gazeY: 0,
  setGazeY: () => {},

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
  const [webGazerInitialised, setwebGazerInitialised] =
    useState<boolean>(false);
  const [gazeX, setGazeX] = useState<number>(0);
  const [gazeY, setGazeY] = useState<number>(0);
  const [textId, setTextId] = useState<string>("");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizResults, setQuizResults] = useState<any>([]);
  const [quizContent, setQuizContent] = useState<QuestionMasked[] | null>([]);

  const initialiseWebGazer = () => {
    if (
      webGazerInitialised ||
      document.querySelector(
        'script[src="https://webgazer.cs.brown.edu/webgazer.js"]',
      )
    ) {
      const webgazer = (window as any).webgazer;
      if (webgazer !== undefined) {
        webgazer.showVideoPreview(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.async = true;

    script.onload = async () => {
      const webgazer = (window as any).webgazer;
      if (webgazer === undefined) {
        console.error("WebGazer not loaded correctly.");
        return;
      }

      await webgazer
        .setRegression("ridge")
        .setGazeListener((data: any, _: any) => {
          if (data == null) return;
          setGazeX(data.x);
          setGazeY(data.y);
        })
        .saveDataAcrossSessions(true)
        .begin();

      await webgazer
        .showPredictionPoints(false)
        .showVideoPreview(true)
        .applyKalmanFilter(true);

      setwebGazerInitialised(true);
    };

    document.body.appendChild(script);
  };

  const endWebGazer = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.end();
      setwebGazerInitialised(false);
    }
  };

  const restartWebGazer = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.clearData();
    }
  };

  const turnOffWebGazerCam = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.showVideoPreview(false);

      const videoContainer = document.getElementById("webgazerVideoContainer");
      if (videoContainer) {
        videoContainer.style.display = "none";
        videoContainer.style.pointerEvents = "none";
      }
    }
  };

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
        webGazerInitialised,
        setwebGazerInitialised,
        initialiseWebGazer,
        endWebGazer,
        restartWebGazer,
        turnOffWebGazerCam,
        gazeX,
        setGazeX,
        gazeY,
        setGazeY,
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
