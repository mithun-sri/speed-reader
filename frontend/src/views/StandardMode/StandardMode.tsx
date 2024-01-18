import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CountdownComponent from "../../components/Counter/Counter";
import { STANDARD_MODE_1 } from "../../common/constants";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import "./StandardMode.css";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

const StandardModeGameView: React.FC<{
  wpm: number;
}> = ({ wpm }) => {
  // TODO: Logic to fetch text here.
  const [showGameScreen, setShowGameScreen] = useState(false);

  const startStandardModeGame = () => {
    setShowGameScreen(true);
  };

  let countdownComp = (
    <CountdownComponent
      duration={3}
      mode={STANDARD_MODE_1}
      onCountdownFinish={startStandardModeGame}
    />
  );

  return (
    <Box>
      <Header />
      {showGameScreen ? <StandardModeGameComponent wpm={wpm} /> : countdownComp}
      <Footer />
    </Box>
  );
};

const StandardModeGameComponent: React.FC<{
  wpm: number;
}> = ({ wpm }) => {
  return (
    <Box
      sx={{
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ReadingTextDisplay
        text="The quick brown fox jumped over the lazy dog"
        wpm={wpm}
      />
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

  useEffect(() => {
    const wordsArray: string[] = text.split(" ");
    setWords(wordsArray);

    const interval = setInterval(() => {
      setWordIndex((prevIndex) => prevIndex + 1);
    }, 60000 / wpm); // Word change every (60000 / wpm) milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [text, wpm]);

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

export default StandardModeGameView;
