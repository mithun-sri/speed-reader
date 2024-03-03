import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDuration, setScrollDuration] = useState(0);
  const lineHeight = 30; // in pixels (Used to calculate scroll speed)
  const containerWidth = 900; // in pixels

  useEffect(() => {
    const calculateScrollDuration = () => {
      if (containerRef.current) {
        // Assuming 10 words per line. This assumption can be made due to the fixed width of the container.
        const wordsPerLine = 10;
        const words = text.split(" ").length;
        const lines = Math.ceil(words / wordsPerLine); // Estimate number of lines
        const textHeight = lines * lineHeight; // Calculate container height taken up by the text

        const wordsPerSecond = wpm / 60;
        const linesPerSecond = wordsPerSecond / 10;
        const scrollSpeed = textHeight / linesPerSecond;
        console.log("container height: " + textHeight);

        const duration = (textHeight * 20) / scrollSpeed; // Calculate scroll duration
        setScrollDuration(duration);
        console.log("duration:" + duration);
      }
    };

    calculateScrollDuration();
  }, [text, wpm, scrollDuration]);

  const handleAnimationComplete = () => {
    // Call incrementCurrentStage function when game ends
    // incrementCurrentStage();
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: `${containerWidth}px`, // Width is fixed to enforce ~10 words per line
        height: `200px`, // Height is fixed
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "green",
      }}
    >
      <motion.p
        initial={{ translateY: "100%" }}
        animate={{ translateY: "-200%" }}
        transition={{ duration: 10, ease: "linear" }}
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
    </div>
  );
};

export default PeripheralTextDisplay;
