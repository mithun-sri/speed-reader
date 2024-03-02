import PropTypes from "prop-types";
import { GameDifficulty, STANDARD_MODE } from "../../common/constants";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { useNextText } from "../../hooks/game";
import HighlightedTextDisplay from "./HighlightedTextDisplay";
import WordTextDisplay from "./WordTextDisplay";

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
  const { setTextId, summarised } = useGameContext();
  const { data: text } = useNextText(summarised);
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
        mode={STANDARD_MODE}
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
            text={text.content}
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
  let display = <HighlightedTextDisplay text={text} wpm={wpm} />;

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
      console.log("Peripheral view not implemented.");
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

// eslint-disable-next-line
const nonHighlightedWord: React.FC<{
  word: string;
}> = ({ word }) => {
  return (
    <JetBrainsMonoText
      text={word}
      size={25}
      color="#646669"
    ></JetBrainsMonoText>
  );
};

const highlightedWord: React.FC<{
  word: string;
}> = ({ word }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 16;
    const maxFontSize = 48;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
  };

  const [fontSize, setFontSize] = useState(calculateFontSize());

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: fontSize,
        color: "#E2B714",
        fontWeight: "bolder",
        textAlign: "center",
        marginTop: "200px",
      }}
    >
      {word}
    </Box>
  );
};

export default StandardModeGameView;
