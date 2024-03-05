import PropTypes from "prop-types";
import { GameDifficulty } from "../../common/constants";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { useNextText } from "../../hooks/game";
import HighlightedTextDisplay from "./HighlightedTextDisplay";
import PeripheralTextDisplay from "./PeripheralTextDisplay";
import WordTextDisplay from "./WordTextDisplay";
import { useWebGazerContext } from "../../context/WebGazerContext";

export enum StandardView {
  Word = 0,
  Highlighted = 1,
  Peripheral = 2,
}

const StandardModeGameView: React.FC<{
  wpm?: number;
  mode?: StandardView;
  difficulty?: GameDifficulty;
}> = ({ wpm, mode }) => {
  const { textId, setTextId_ } = useWebGazerContext();
  const { setTextId, summarised } = useGameContext();
  const getText = () => {
    if (textId === null) {
      return useNextText(summarised);
    } else {
      /* TODO: Fix this */
      setTextId_(null);
      return useNextTextById(summarised, textId);
    }
  }
  const { data: text } = getText();
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
            view={mode || StandardView.Word} // Handle undefined mode
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
    StandardView.Word,
    StandardView.Highlighted,
    StandardView.Peripheral,
  ]),
};

const StandardModeGameComponent: React.FC<{
  wpm: number;
  text: string;
  view: StandardView;
}> = ({ wpm, text, view }) => {
  let display = <WordTextDisplay text={text} wpm={wpm} />;

  switch (view) {
    case StandardView.Word: {
      display = <WordTextDisplay text={text} wpm={wpm} />;
      break;
    }
    case StandardView.Highlighted: {
      display = <HighlightedTextDisplay text={text} wpm={wpm} />;
      break;
    }
    case StandardView.Peripheral: {
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
    StandardView.Word,
    StandardView.Highlighted,
    StandardView.Peripheral,
  ]).isRequired,
};

export default StandardModeGameView;
