import PropTypes from "prop-types";
import { calculateAverageWpm } from "../../common/constants";
import "./StandardMode.css";

import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import BlurBox from "../../components/Blur/Blur";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import WpmSign from "../../components/WpmSign/WpmSign";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

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

export default WordTextDisplay;
