import Box from "@mui/material/Box";
import React, { useContext, useEffect, useState } from "react";
import {
  ADAPTIVE_MODE,
  EASY,
  GameDifficulty,
  HARD,
  MED,
  STANDARD_MODE,
  SUMMARISED_ADAPTIVE_MODE,
} from "../../common/constants";
import Carousel from "../../components/Carousel/Carousel";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useGameContext } from "../../context/GameContext";
import ModeSelectView from "../ModeSelect/ModeSelect";
import PreGameView from "../PreGame/PreGame";
import Quiz from "../Quiz/Quiz";
import StandardModeGameView from "../StandardMode/StandardMode";
import StandardSubModeView from "../StandardMode/StandardSubMode";

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
  return <StandardSubModeView />;
};

const WpmSelect = () => {
  return <PreGameView />;
};

const DiffSelect = () => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { setDifficulty } = useGameContext();
  const [valueFromCarousel, setValueFromCarousel] = useState<number>(-1); // To retrieve selected index from Carousel

  const options: GameDifficulty[] = [EASY, MED, HARD];

  // Callback function to handle the selected index form the Carousel
  const handleValueFromCarousel = (value: number) => {
    setValueFromCarousel(value);
  };

  // setMode according to the selected index from options
  useEffect(() => {
    if (valueFromCarousel >= 0 && valueFromCarousel < options.length) {
      setDifficulty(options[valueFromCarousel]);
      incrementCurrentStage(); // Go to the next view in GameScreen
    }
  }, [valueFromCarousel, setDifficulty]);

  return (
    <Box>
      <Header />
      <Box
        sx={{
          backgroundColor: "#2c2e31",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
        }}
      >
        <Carousel
          title="choose text difficulty."
          options={options}
          returnSelectedIndex={handleValueFromCarousel}
        />
        <Footer />
      </Box>
    </Box>
  );
};

const GameView = () => {
  const { mode, wpm, view } = useGameContext();

  let gameView = null;
  if (mode === STANDARD_MODE) {
    console.log(`wpm is ${wpm}`);
    gameView = <StandardModeGameView wpm={wpm!} mode={view!} />;
  } else if (mode === ADAPTIVE_MODE) {
    gameView = <div> ADAPTIVE MODE. </div>;
  } else if (mode === SUMMARISED_ADAPTIVE_MODE) {
    gameView = <div> SUMMARISED ADAPTIVE MODE. </div>;
  } else {
    console.log("Error rendering Game view.");
    throw new Error("Invalid or null mode. Please use one of GameMode");
  }

  return gameView;
};

export const GameScreen = () => {
  const { mode } = useGameContext();
  const [currentStage, setCurrentStage] = useState(0);
  const incrementCurrentStage = () => {
    setCurrentStage(currentStage + 1);
  };

  const stages = [
    <ModeSelectView key={0} />,
    <DiffSelect key={1} />,
    <StandardSelect key={2} />, // to be skipped if mode is not standard
    <WpmSelect key={3} />, // to be skipped if mode is not standard
    <GameView key={4} />,
    <Quiz key={5} />,
  ];

  useEffect(() => {
    // If mode is not standard, skip StandardSelect & WpmSelect and jump straight to Game
    if (mode !== STANDARD_MODE && currentStage === 2) {
      setCurrentStage(4);
    }
  }, [mode, currentStage]);

  return (
    <GameScreenContext.Provider value={{ currentStage, incrementCurrentStage }}>
      {stages[currentStage]}
    </GameScreenContext.Provider>
  );
};
