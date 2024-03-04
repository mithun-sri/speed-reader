import { Box } from "@mui/system";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BlurBox from "../../components/Blur/Blur";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import { wpmAdjuster } from "../../components/WpmAdjuster/WpmAdjuster";
import WpmSign from "../../components/WpmSign/WpmSign";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

/*
  Mode 1.3 (Word): Standard mode displaying the text one word at a time 
  based on the specified words per minute (wpm).
*/
const PeripheralTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { intervalWpms, setIntervalWpms, setAverageWpm } = useGameContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [curr_wpm, setWpm] = useState(wpm);
  const [isPaused, setPaused] = useState(false);
  const [scrollDuration, setScrollDuration] = useState(100);

  // Assuming 10 words per line. This assumption can be made due to the fixed width of the container.
  const lineHeight = 30; // in pixels (Used to calculate scroll speed)
  const containerWidth = 900; // in pixels
  const wordsPerLine = 10;
  const words = text.split(" ").length;
  const lines = Math.ceil(words / wordsPerLine); // Estimate number of lines

  // initialize intervalWpms list with initial wpm on component first render
  useEffect(() => {
    setIntervalWpms([wpm]);
  }, []);

  const calculateScrollDuration = () => {
    if (words > 0 && containerRef.current) {
      const linesPerSecond = curr_wpm / (60 * wordsPerLine);
      const timePerLine = 1 / linesPerSecond;

      // Multiply time per line by total number of lines to get the duration
      const duration = timePerLine * lines;
      console.log("Duration: " + duration);

      return duration;
    }
    return scrollDuration;
  };

  useEffect(() => {
    setScrollDuration(calculateScrollDuration());
  }, [text, curr_wpm]);

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

  const handleAnimationComplete = () => {
    /*
    const avg_wpm = calculateAverageWpm(intervalWpms);
      setAverageWpm(avg_wpm);

      incrementCurrentStage();
      console.log("intervalWpms: ");
      console.log(intervalWpms);
      */
  };

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
        ref={containerRef}
        sx={{
          marginTop: "160px",
          width: `${containerWidth}px`,
          padding: "10px",
          display: "flex",
          height: "200px",
          flexWrap: "wrap",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "green",
        }}
      >
        <motion.p
          initial={{ translateY: "100%" }}
          animate={{ translateY: "-200%" }}
          transition={{ duration: scrollDuration, ease: "linear" }}
          style={{
            fontSize: "22px",
            fontFamily: "JetBrains Mono, monospace",
            color: "#D1D0C5",
            fontWeight: "bolder",
            textAlign: "left",
            lineHeight: `${lineHeight}px`,
            position: "relative",
            margin: 0, // Remove margin for accurate scrolling
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          {text}
        </motion.p>
        <Box
          sx={{
            width: window.innerWidth / 2,
            paddingTop: "200px",
            paddingBottom: "10px",
          }}
        >
          <GameProgressBar gameProgress={0} />
        </Box>
      </Box>
    </Box>
  );
};

export default PeripheralTextDisplay;
