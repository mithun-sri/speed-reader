import React, { useContext, useState } from "react";
import {
  ADAPTIVE_MODE,
  GameMode,
  STANDARD_MODE,
  SUMMARISED_MODE,
} from "../../common/constants";
import { GameProvider, useGameContext } from "../../context/GameContext";
import AdaptiveModeView from "../AdaptiveMode/AdaptiveMode";
import DiffSelect from "../DiffSelect/DiffSelect";
import ModeSelectView from "../ModeSelect/ModeSelect";
import Quiz from "../Quiz/Quiz";
import ResultsPage from "../Results/ResultsPage";
import StandardModeGameView from "../StandardMode/StandardMode";
import StandardSubModeView from "../StandardMode/StandardSubMode";
import SummarisedSubMode from "../SummarizedMode/SummarizedSubMode";
import WebGazerCalibration from "../WebGazerCalibration/WebGazerCalibration";
import WpmView from "../WpmView/WpmView";

export const GameScreenContext = React.createContext<{
  currentStage: number;
  incrementCurrentStage: (modeArg?: GameMode) => void;
  decrementCurrentStage: () => void;
  playAgain: () => void;
}>({
  currentStage: 0,
  incrementCurrentStage: () => {},
  decrementCurrentStage: () => {},
  playAgain: () => {},
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
  return <WpmView />;
};

const GameView = () => {
  const { mode, wpm, view } = useGameContext();

  let gameView = null;
  if (mode === STANDARD_MODE) {
    gameView = <StandardModeGameView wpm={wpm!} mode={view!} />;
  } else if (mode === ADAPTIVE_MODE) {
    gameView = <AdaptiveModeView />;
  } else {
    console.log("Error rendering Game view.");
    throw new Error("Invalid or null mode. Please use one of GameMode");
  }

  return gameView;
};

const GameScreen = () => {
  const { mode, summarised } = useGameContext();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    <ModeSelectView key={0} />,
    <SummarisedSubMode key={1} />,
    <DiffSelect key={2} />,
    <StandardSelect key={3} />, // to be skipped if mode is not standard
    <WpmSelect key={4} />, // to be skipped if mode is not standard
    <WebGazerCalibration key={5} />, // to be skipped if mode is standard
    <GameView key={6} />,
    <Quiz key={7} />,
    <ResultsPage key={8} />,
  ];

  const MODE_SELECT_STAGE = 0;
  const SUMMARISED_SUB_MODE_STAGE = 1;
  const DIFF_SELECT_STAGE = 2;
  const STANDARD_SELECT_STAGE = 3;
  const WPM_SELECT_STAGE = 4;
  const CALIBRATION_STAGE = 5;
  const GAME_STAGE = 6;

  const incrementCurrentStage = (modeArg?: GameMode) => {
    const newStage = currentStage + 1;
    const _mode = modeArg === undefined ? mode : modeArg;
    console.log("mode is: " + _mode);
    if (_mode !== SUMMARISED_MODE && newStage === SUMMARISED_SUB_MODE_STAGE) {
      setCurrentStage(DIFF_SELECT_STAGE);
    } else if (_mode !== STANDARD_MODE && newStage === STANDARD_SELECT_STAGE) {
      setCurrentStage(CALIBRATION_STAGE);
    } else if (_mode === STANDARD_MODE && newStage === CALIBRATION_STAGE) {
      setCurrentStage(GAME_STAGE);
    } else {
      setCurrentStage(newStage);
    }
  };

  const decrementCurrentStage = () => {
    const newStage = currentStage - 1;

    if (!summarised && newStage === SUMMARISED_SUB_MODE_STAGE) {
      setCurrentStage(MODE_SELECT_STAGE);
    } else if (mode !== STANDARD_MODE && newStage === WPM_SELECT_STAGE) {
      setCurrentStage(DIFF_SELECT_STAGE);
    } else if (mode === STANDARD_MODE && newStage === CALIBRATION_STAGE) {
      setCurrentStage(WPM_SELECT_STAGE);
    } else {
      setCurrentStage(newStage);
    }
  };

  const playAgain = () => {
    setCurrentStage(GAME_STAGE);
  };

  return (
    <GameScreenContext.Provider
      value={{
        currentStage,
        incrementCurrentStage,
        decrementCurrentStage,
        playAgain,
      }}
    >
      {stages[currentStage]}
    </GameScreenContext.Provider>
  );
};

// When GamePage is re-rendered (i.e. unmounted), GameContext will be cleared.
// Note: Since GameScreen is using 'mode' from the GameContext, GameProvider has to be wrapped
// around a parent of GameScreen, hence why we need GamePage.
export const GamePage = () => {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
};
