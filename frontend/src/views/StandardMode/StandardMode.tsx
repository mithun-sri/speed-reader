import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CountdownComponent from "../../components/Counter/Counter";
import { STANDARD_MODE_1 } from "../../common/constants";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import PropTypes from 'prop-types';
import "./StandardMode.css";
import axios, { AxiosResponse, AxiosError } from 'axios';

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

interface TextsApiResponse {
  text: string;
}

const StandardModeGameView: React.FC<{
  wpm?: number;
}> = ({ wpm }) => {
  const [text, setText] = useState("The quick brown fox jumped over the lazy dog");

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.API_HOSTNAME}/api/v1/game/texts`,
      headers: { }
    };

    axios.request(config)
      .then((response: AxiosResponse<TextsApiResponse>) => {
        console.log(JSON.stringify(response.data));
        setText(response.data.text);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }
  , []);

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
        <StandardModeGameComponent wpm={wpm || 200} text={text} />
      ) : (
        countdownComp
      )}
      <Footer />
    </Box>
  );
};

StandardModeGameView.propTypes = {
  wpm: PropTypes.number,
};

const StandardModeGameComponent: React.FC<{
  wpm: number;
  text: string;
}> = ({ wpm, text }) => {
  return (
    <Box
      sx={{
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ReadingTextDisplay text={text} wpm={wpm} />
      <Box
        sx={{
          padding: "10px",
          width: "50%",
          display: "flex",
          flexDirection: "column",
          textAlign: "start",
        }}
      >
        <JetBrainsMonoText
          text="WPM: "
          size={15}
          color="#fff"
        ></JetBrainsMonoText>
        <Box style={{ marginTop: "10px" }}></Box>
        <JetBrainsMonoText
          text="Words remaining: "
          size={15}
          color="#fff"
        ></JetBrainsMonoText>
      </Box>
    </Box>
  );
};

StandardModeGameComponent.propTypes = {
  wpm: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

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

const ReadingTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm, size }) => {
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [curr_wpm, setWpm] = useState(wpm);

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code === "ArrowUp") {
      console.log("ArrowUp");
      setWpm(curr_wpm + 5);
      console.log(curr_wpm);
    }
    if (event.code === "ArrowDown") {
      console.log("ArrowDown");
      setWpm(curr_wpm - 5);
      console.log(curr_wpm);
    }
  };
  // updates WPM based on keyboard event
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
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

ReadingTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  size: PropTypes.number,
};

export default StandardModeGameView;
