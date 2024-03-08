import PropTypes from "prop-types";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { GameViewType, useGameContext } from "../../context/GameContext";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { useNextText, useTextById } from "../../hooks/game";
import HighlightedTextDisplay from "./HighlightedTextDisplay";
import PeripheralTextDisplay from "./PeripheralTextDisplay";
import WordTextDisplay from "./WordTextDisplay";
import { lowerCase, sum } from "cypress/types/lodash";

export enum StandardView {
  Word = 0,
  Highlighted = 1,
  Peripheral = 2,
}

const StandardModeGameView: React.FC<{
  wpm?: number;
  mode?: GameViewType;
}> = ({ wpm, mode }) => {
  const { textId_, setTextId_ } = useWebGazerContext();
  const { textId, setTextId, summarised, difficulty } = useGameContext();
  const [showGameScreen, setShowGameScreen] = useState(false);

  const getText = () => {
    if (textId_ !== null) {
      setTextId(textId_);
      return useTextById(textId_);
    } else {
      const text = useNextText(summarised, difficulty?.toLowerCase() || "easy");
      setTextId(text.data.id);
      return text;
    }
  }

  const {data: text} = getText();

  const startStandardModeGame = () => {
    setShowGameScreen(true);
  };

  const countdownComp = (
    <Box
      sx={{
        marginTop: "100px",
      }}
    >
      <CountdownComponent
        duration={3}
        onCountdownFinish={startStandardModeGame}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-20vh",
        }}
      >
        {showGameScreen ? (
          <StandardModeGameComponent
            wpm={wpm || 200} // Handle undefined wpm
            // TODO:
            // OpenAPI generator fails to interpret Python's `Optional` type
            // and assigns `interface{}` to `summary`.
            text={summarised ? (text.summary as string) : text.content}
            view={mode || GameViewType.StandardWord} // Handle undefined mode
          />
        ) : (
          countdownComp
        )}
      </Box>
    </Box>
  );
};

StandardModeGameView.propTypes = {
  wpm: PropTypes.number,
  mode: PropTypes.oneOf([
    GameViewType.StandardWord,
    GameViewType.StandardHighlighted,
    GameViewType.StandardPeripheral,
  ]),
};

const StandardModeGameComponent: React.FC<{
  wpm: number;
  text: string;
  view: GameViewType;
}> = ({ wpm, text, view }) => {
  let display = <WordTextDisplay text={text} wpm={wpm} />;

  switch (view) {
    case GameViewType.StandardWord: {
      display = <WordTextDisplay text={text} wpm={wpm} />;
      break;
    }
    case GameViewType.StandardHighlighted: {
      display = <HighlightedTextDisplay text={text} wpm={wpm} />;
      break;
    }
    case GameViewType.StandardPeripheral: {
      display = <PeripheralTextDisplay text={text} wpm={wpm} />;
      break;
    }
    default: {
      console.log("Invalid Standard submode / view.");
      break;
    }
  }

  return (
    <Box
      sx={{
        padding: "25px",
      }}
    >
      {display}
    </Box>
  );
};

StandardModeGameComponent.propTypes = {
  wpm: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  view: PropTypes.oneOf([
    GameViewType.StandardWord,
    GameViewType.StandardHighlighted,
    GameViewType.StandardPeripheral,
  ]).isRequired,
};

export default StandardModeGameView;
