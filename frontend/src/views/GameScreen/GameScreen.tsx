import React, { useContext, useEffect, useState } from "react";
import { STANDARD_MODE } from "../../common/constants";
import { useGameContext } from "../../context/GameContext";
import ModeSelectView from "../ModeSelect/ModeSelect";
import PreGameView from "../PreGame/PreGame";
import Quiz from "../Quiz/Quiz";

const GameScreenContext = React.createContext<{
  currentStage: number;
  incrementCurrentStage: () => void;
}>({
  currentStage: 0,
  incrementCurrentStage: () => {},
});

export const useGameScreenContext = () => {
  const context = useContext(GameScreenContext);
  if (!context) {
    console.log("Error UseGameScreenContext");
    throw new Error(
      "useGameScreenContext must be used within a GameScreenContext.Provider",
    );
  }
  return context;
};

const StandardSelect = () => {
  const { incrementCurrentStage } = useGameScreenContext();

  return <button onClick={() => incrementCurrentStage}>Standard Select</button>;
};

const WpmSelect = () => {
  return <PreGameView />;
};

const DiffSelect = () => {
  const { incrementCurrentStage } = useGameScreenContext();

  return <button onClick={() => incrementCurrentStage}>Go to Quiz</button>;
};

const Game = () => {
  const { incrementCurrentStage } = useGameScreenContext();

  return <button onClick={() => incrementCurrentStage}>Go to Quiz</button>;
};

export const GameScreen = () => {
  const { mode } = useGameContext();
  const [currentStage, setCurrentStage] = useState(0);
  const incrementCurrentStage = () => {
    setCurrentStage(currentStage + 1);
  };

  const stages = [
    <ModeSelectView />,
    <StandardSelect />, // will be skipped if mode is not standard
    <WpmSelect />,
    <DiffSelect />,
    <Game />,
    <Quiz />,
  ];

  useEffect(() => {
    // If mode is not standard, skip StandardSelect by incrementing currentStage
    if (mode !== STANDARD_MODE && currentStage === 1) {
      setCurrentStage(2);
    }
  }, [mode, currentStage]);

  return (
    <GameScreenContext.Provider value={{ currentStage, incrementCurrentStage }}>
      {stages[currentStage]}
    </GameScreenContext.Provider>
  );
};
