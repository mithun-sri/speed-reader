import PropTypes from "prop-types";
import { GameDifficulty } from "../../common/constants";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { GameViewType, useGameContext } from "../../context/GameContext";
import { useNextText } from "../../hooks/game";
import HighlightedTextDisplay from "./HighlightedTextDisplay";
import PeripheralTextDisplay from "./PeripheralTextDisplay";
import WordTextDisplay from "./WordTextDisplay";

const StandardModeGameView: React.FC<{
  wpm?: number;
  mode?: GameViewType;
  difficulty?: GameDifficulty;
}> = ({ wpm, mode }) => {
  const { setTextId, summarised, difficulty } = useGameContext();
  const { data: text } = useNextText(summarised, difficulty || undefined);
  const [showGameScreen, setShowGameScreen] = useState(false);

  useEffect(() => {
    setTextId(text.id);
  }, [text]);

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
