import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
  Mode 1.3 (Word): Standard mode displaying the text one word at a time 
  based on the specified words per minute (wpm).
*/
const PeripheralTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDuration, setScrollDuration] = useState(0);
  const lineHeight = 30; // Line height in pixels (Used to calculate scroll speed)

  useEffect(() => {
    const calculateScrollDuration = () => {
      if (containerRef.current) {
        const wordsPerLine = 10; // Assuming 10 words per line
        const words = text.split(" ").length;
        const lines = Math.ceil(words / wordsPerLine); // Estimate number of lines
        const containerHeight = lines * lineHeight; // Calculate container height ------- 120px

        const wordsPerSecond = wpm / 60; // Convert WPM to words per second
        const scrollSpeed = containerHeight / wordsPerSecond; // Calculate scroll speed
        console.log("container height: " + containerHeight);

        const duration = scrollSpeed / containerHeight; // Calculate scroll duration
        setScrollDuration(duration);
        console.log("duration:" + duration);
      }
    };

    calculateScrollDuration();
  }, [text, wpm]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "1000px", // Width is fixed to enforce ~10 words per line
        height: "100vh", // Adjust this height as needed
        position: "relative",
      }}
    >
      <motion.p
        initial={{ translateY: "100%" }}
        animate={{ translateY: "-200%" }}
        transition={{ duration: scrollDuration, ease: "linear" }}
        style={{
          fontSize: "20px",
          fontFamily: "JetBrains Mono, monospace",
          color: "#D1D0C5",
          fontWeight: "bolder",
          textAlign: "left",
          lineHeight: `${lineHeight}px`,
          position: "absolute",
          bottom: 0,
          left: 0,
          margin: 0, // Remove margin for accurate scrolling
        }}
      >
        {text}
      </motion.p>
    </div>
  );
};
// width: "1000px",
// height: "100vh", // Adjust this height as needed

export default PeripheralTextDisplay;
