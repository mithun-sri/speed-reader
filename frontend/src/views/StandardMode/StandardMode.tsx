import Header from "../../components/Header/Header";
import CountdownComponent from "../../components/Counter/Counter";
import { STANDARD_MODE_1 } from "../../common/constants";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import PropTypes from "prop-types";
import "./StandardMode.css";
import axios, { AxiosResponse, AxiosError } from "axios";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

export enum StandardMode {
  Word = 0,
  Justified = 1,
}

interface TextsApiResponse {
  text: string;
}

const StandardModeGameView: React.FC<{
  wpm?: number;
  mode?: StandardMode;
}> = ({ wpm, mode }) => {
  const [text, setText] = useState(
    "The quick brown fox jumped over the lazy dog",
  );

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.API_HOSTNAME}/api/v1/game/texts`,
      headers: {},
    };

    axios
      .request(config)
      .then((response: AxiosResponse<TextsApiResponse>) => {
        console.log(JSON.stringify(response.data));
        setText(response.data.text);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }, []);

  const [showGameScreen, setShowGameScreen] = useState(false);

  const startStandardModeGame = () => {
    setShowGameScreen(true);
  };

  const countdownComp = (
    <CountdownComponent
      duration={3}
      mode={STANDARD_MODE_1}
      onCountdownFinish={startStandardModeGame}
    />
  );

  return (
    <Box>
      <Header />
      {showGameScreen ? (
        <StandardModeGameComponent
          wpm={wpm || 200}
          text={text}
          mode={mode || StandardMode.Word}
        />
      ) : (
        countdownComp
      )}
    </Box>
  );
};

StandardModeGameView.propTypes = {
  wpm: PropTypes.number,
  mode: PropTypes.oneOf([StandardMode.Word, StandardMode.Justified]),
};

const StandardModeGameComponent: React.FC<{
  wpm: number;
  text: string;
  mode: StandardMode;
}> = ({ wpm, text, mode }) => {
  return (
    <Box
      sx={{
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {mode == StandardMode.Word ? (
        <WordTextDisplay text={text} wpm={wpm} />
      ) : (
        <JustifiedTextDisplay text={text} wpm={wpm} />
      )}
    </Box>
  );
};

StandardModeGameComponent.propTypes = {
  wpm: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  mode: PropTypes.oneOf([StandardMode.Word, StandardMode.Justified]).isRequired,
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
  return (
    <JetBrainsMonoText
      text={word}
      size={30}
      color="#E2B714"
    ></JetBrainsMonoText>
  );
};

/*
  Mode 1.1 (Word): Standard mode displaying the text one word at a time 
  based on the specified words per minute (wpm).
*/
const WordTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [curr_wpm, setWpm] = useState(wpm);

  // updates WPM based on keyboard event
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) =>
      wpmAdjuster(event, curr_wpm, setWpm);
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [curr_wpm]);

  // updates which word to be shown
  useEffect(() => {
    const wordsArray: string[] = text.split(" ");
    setWords(wordsArray);

    const interval = setInterval(() => {
      setWordIndex((prevIndex) => prevIndex + 1);
    }, 60000 / curr_wpm); // Word change every (60000 / wpm) milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [text, curr_wpm]);

  return (
    <Box
      sx={{
        width: "80%",
        padding: "25px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {highlightedWord({ word: words[wordIndex] })}
    </Box>
  );
};

WordTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  size: PropTypes.number,
};

/*
  Mode 1.2 (Justified): Standard mode displaying the entire text in a justified format across multiple lines.
  Words are highlighted sequentially based on the specified words per minute (wpm).
*/
const JustifiedTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [curr_wpm, setWpm] = useState(wpm);

  // updates WPM based on keyboard event
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) =>
      wpmAdjuster(event, curr_wpm, setWpm);
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [curr_wpm]);

  // updates which word to be highlighted
  useEffect(() => {
    const wordsArray = text.split(" ");

    const interval = setInterval(() => {
      setHighlightedIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        return newIndex < wordsArray.length ? newIndex : prevIndex;
      });
    }, 60000 / curr_wpm);

    return () => {
      clearInterval(interval);
    };
  }, [text, curr_wpm]);

  return (
    <Box
      sx={{
        width: "500px",
        padding: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {text.split(" ").map((word, index) => (
        <Box
          component="span"
          key={index}
          sx={{
            marginRight: "8px",
          }}
        >
          <JetBrainsMonoText
            text={word}
            size={25}
            color={index <= highlightedIndex ? "#E2B714" : "#646669"}
          ></JetBrainsMonoText>
        </Box>
      ))}
    </Box>
  );
};

JustifiedTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  size: PropTypes.number,
};

// Handles keyboard events for adjusting words per minute (WPM).
const wpmAdjuster = (
  event: KeyboardEvent,
  curr_wpm: number,
  setWpm: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (event.code === "ArrowUp") {
    console.log("ArrowUp");
    setWpm(curr_wpm + 5);
    console.log(curr_wpm);
  }
  if (event.code === "ArrowDown") {
    console.log("ArrowDown");
    setWpm(Math.max(curr_wpm - 5, 1));
    console.log(curr_wpm);
  }
};

export default StandardModeGameView;
