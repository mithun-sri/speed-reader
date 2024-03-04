import { Box } from "@mui/system";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { calculateAverageWpm } from "../../common/constants";
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

  const controls = useAnimation();
  const initialTranslateY = 100;
  const finalTranslateY = -150;
  const totalTranslateY = initialTranslateY - finalTranslateY;
  const [currentTranslateY, setCurrentTranslateY] =
    useState<number>(initialTranslateY);

  // Assuming 10 words per line. This assumption can be made due to the fixed width of the container.
  const containerWidth = 900; // in pixels
  const wordsPerLine = 10;
  const words = text.split(" ").length;
  const lines = Math.ceil(words / wordsPerLine); // Estimate number of lines

  // initialize intervalWpms list with initial wpm on component first render
  useEffect(() => {
    setIntervalWpms([wpm]);
  }, []);

  // record WPM every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setIntervalWpms([...intervalWpms, curr_wpm]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [curr_wpm, intervalWpms, isPaused]);

  const calculateScrollDuration = () => {
    if (words > 0 && containerRef.current) {
      const linesPerSecond = curr_wpm / (60 * wordsPerLine);
      const timePerLine = 1 / linesPerSecond;

      // Multiply time per line by total number of lines to get the duration
      const duration = timePerLine * lines;

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

  useEffect(() => {
    const updateTranslateY = () => {
      const textScroll = document.getElementById("textScroll");
      if (!textScroll) return;

      // Get the translateY value from controls
      const transform = textScroll.style.transform;
      const translateYMatch = transform.match(/translateY\((-?\d+\.?\d*)%\)/);

      // Extract the percentage value from the match
      const translateY = translateYMatch ? parseFloat(translateYMatch[1]) : 0;
      setCurrentTranslateY(translateY);
    };

    const updateInterval = setInterval(updateTranslateY, 10);

    return () => clearInterval(updateInterval);
  }, [controls]);

  const handleAnimationComplete = () => {
    const avg_wpm = calculateAverageWpm(intervalWpms);
    setAverageWpm(avg_wpm);

    incrementCurrentStage();
    console.log("intervalWpms: ");
    console.log(intervalWpms);
  };

  useEffect(() => {
    if (currentTranslateY === finalTranslateY) {
      handleAnimationComplete();
    }
  }, [currentTranslateY]);

  useEffect(() => {
    if (isPaused) {
      controls.stop(); // Pause the animation
    } else {
      controls.start({
        translateY: [`${currentTranslateY}%`, `${finalTranslateY}%`],
        transition: {
          duration:
            scrollDuration *
            ((currentTranslateY - finalTranslateY) / totalTranslateY),
          ease: "linear",
          from: "end",
        },
      });
    }
  }, [isPaused, scrollDuration, controls]);

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
          backgroundColor: "#595d64",
          borderRadius: "10px",
        }}
      >
        <motion.p
          id="textScroll"
          initial={{ translateY: `${currentTranslateY}%` }}
          animate={controls}
          style={{
            fontSize: "22px",
            fontFamily: "JetBrains Mono, monospace",
            color: "#D1D0C5",
            fontWeight: "bolder",
            textAlign: "left",
            lineHeight: "30px",
            position: "relative",
            margin: 0,
          }}
        >
          {text}
        </motion.p>
      </Box>
      <Box
        sx={{
          width: window.innerWidth / 2,
          paddingTop: "200px",
          paddingBottom: "10px",
        }}
      >
        <GameProgressBar
          gameProgress={
            ((initialTranslateY - currentTranslateY) / totalTranslateY) * 100
          }
        />
      </Box>
    </Box>
  );
};

export default PeripheralTextDisplay;
