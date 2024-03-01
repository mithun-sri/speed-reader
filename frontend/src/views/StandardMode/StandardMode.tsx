import PropTypes from "prop-types";
import {
  calculateAverageWpm,
  GameDifficulty,
  STANDARD_MODE,
} from "../../common/constants";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import BlurBox from "../../components/Blur/Blur";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import WpmSign from "../../components/WpmSign/WpmSign";
import { useGameContext } from "../../context/GameContext";
import { useNextText } from "../../hooks/game";
import { useGameScreenContext } from "../GameScreen/GameScreen";

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

/*
  Mode 1.1 (Word): Standard mode displaying the text one word at a time 
  based on the specified words per minute (wpm).
*/
const WordTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { intervalWpms, setIntervalWpms, setAverageWpm } = useGameContext();
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [curr_wpm, setWpm] = useState(wpm);
  const [isPaused, setPaused] = useState(false);

  // initialize intervalWpms list with initial wpm on component first render
  useEffect(() => {
    setIntervalWpms([wpm]);
  }, []);

  // updates WPM based on keyboard event
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === " ") {
        setPaused((prevPaused) => !prevPaused);
      } else {
        wpmAdjuster(event, curr_wpm, setWpm);
      }
    };
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [curr_wpm, isPaused]);

  // updates which word to be shown
  useEffect(() => {
    const wordsArray: string[] = text.split(" ");
    setWords(wordsArray);

    const interval = setInterval(() => {
      if (!isPaused) {
        setWordIndex((prevIndex) => prevIndex + 1);
      }
    }, 60000 / curr_wpm); // Word change every (60000 / wpm) milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [text, curr_wpm, isPaused]);

  // calculate avg wpm and navigate to next screen (quiz) when game ends
  useEffect(() => {
    if (wordIndex === words.length && words.length > 0) {
      const avg_wpm = calculateAverageWpm(intervalWpms);
      setAverageWpm(avg_wpm);

      incrementCurrentStage();

      console.log("intervalWpms: " + intervalWpms);
    }
  }, [wordIndex, words.length]);

  // record WPM every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setIntervalWpms([...intervalWpms, curr_wpm]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [curr_wpm, intervalWpms, isPaused]);

  return (
    <Box>
      <WpmSign wpm={curr_wpm} />
      {isPaused && <BlurBox />}
      <Box
        sx={{
          padding: "25px",
        }}
      >
        {highlightedWord({ word: words[wordIndex] })}
      </Box>
      <Box
        sx={{
          width: window.innerWidth / 2,
          paddingTop: "200px",
        }}
      >
        <GameProgressBar
          gameProgress={(wordIndex / (words.length - 1)) * 100}
        />
      </Box>
    </Box>
  );
};

WordTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  size: PropTypes.number,
};

/*
  Mode 1.2 (Highlighted): Standard mode displaying the entire text across multiple lines.
  Words are highlighted sequentially based on the specified words per minute (wpm).
*/
export const HighlightedTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { intervalWpms, setIntervalWpms, setAverageWpm } = useGameContext();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [curr_wpm, setWpm] = useState(wpm);
  const [isPaused, setPaused] = useState(false);

  const wordsPerFrame = 30;
  const wordsArray = text.split(" ");

  // initialize intervalWpms list with initial wpm on component first render
  useEffect(() => {
    setIntervalWpms([wpm]);
  }, []);

  // updates WPM based on keyboard event
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === " ") {
        setPaused((prevPaused) => !prevPaused);
      } else {
        wpmAdjuster(event, curr_wpm, setWpm);
      }
    };
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [curr_wpm, isPaused]);

  // updates which word to be highlighted
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setHighlightedIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          setWordIndex(newIndex);
          return newIndex < wordsArray.length ? newIndex : prevIndex;
        });
      }
    }, 60000 / curr_wpm);

    return () => {
      clearInterval(interval);
    };
  }, [text, curr_wpm, isPaused]);

  // calculate avg wpm and navigate to next screen (quiz) when game ends
  useEffect(() => {
    if (wordIndex === wordsArray.length && wordsArray.length > 0) {
      const avg_wpm = calculateAverageWpm(intervalWpms);
      setAverageWpm(avg_wpm);

      incrementCurrentStage();
      console.log("intervalWpms: ");
      console.log(intervalWpms);
    }
  }, [wordIndex, wordsArray.length]);

  // record WPM every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setIntervalWpms([...intervalWpms, curr_wpm]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [curr_wpm, intervalWpms, isPaused]);

  // calculates which words should be shown on the screen (in the current frame)
  const currentFrameIndex = Math.floor(highlightedIndex / wordsPerFrame);
  const visibleText = text
    .split(" ")
    .slice(
      currentFrameIndex * wordsPerFrame,
      (currentFrameIndex + 1) * wordsPerFrame,
    )
    .join(" ");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <WpmSign wpm={curr_wpm} />
      {isPaused && <BlurBox />}
      <Box
        sx={{
          marginTop: "160px",
          width: "50vw",
          padding: "10px",
          display: "flex",
          height: "200px",
          flexWrap: "wrap",
          // marginBottom: "0px"
        }}
      >
        {visibleText.split(" ").map((word, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              margin: "0.4em",
            }}
          >
            <JetBrainsMonoText
              text={word}
              size={window.innerWidth / 60}
              color={
                index <= highlightedIndex % wordsPerFrame
                  ? "#E2B714"
                  : "#646669"
              }
            ></JetBrainsMonoText>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          width: window.innerWidth / 2,
          paddingTop: "200px",
          paddingBottom: "10px",
        }}
      >
        <GameProgressBar
          gameProgress={(wordIndex / (wordsArray.length - 1)) * 100}
        />
      </Box>
    </Box>
  );
};

HighlightedTextDisplay.propTypes = {
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
    const new_wpm = curr_wpm + 10;
    setWpm(new_wpm);
    console.log(new_wpm);
  }
  if (event.code === "ArrowDown") {
    console.log("ArrowDown");
    const new_wpm = Math.max(curr_wpm - 10, 1);
    setWpm(new_wpm);
    console.log(new_wpm);
  }
};

export default StandardModeGameView;
