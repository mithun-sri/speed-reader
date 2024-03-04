import PropTypes from "prop-types";
import { calculateAverageWpm } from "../../common/constants";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import BlurBox from "../../components/Blur/Blur";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { wpmAdjuster } from "../../components/WpmAdjuster/WpmAdjuster";
import WpmSign from "../../components/WpmSign/WpmSign";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

/*
  Mode 1.2 (Highlighted): Standard mode displaying the entire text across multiple lines.
  Words are highlighted sequentially based on the specified words per minute (wpm).
*/
const HighlightedTextDisplay: React.FC<{
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

export default HighlightedTextDisplay;
