import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { ADAPTIVE_MODE } from "../../common/constants";
import { useGameContext } from "../../context/GameContext";

const CountdownComponent: React.FC<{
  duration: number;
  onCountdownFinish?: () => void;
}> = ({ duration, onCountdownFinish }) => {
  const [count, setCount] = useState(duration);
  const [fontSize, setFontSize] = useState(calculateFontSize());
  const { mode } = useGameContext();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      console.log(Date.now());

      if (count === 1) {
        clearInterval(countdownInterval);
        // Add your game initialization logic here
        if (onCountdownFinish) onCountdownFinish();
      } else {
        setCount((prevCount) => prevCount - 1);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval); // Cleanup on component unmount
    };
  }, [count, onCountdownFinish]);

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Run effect only once on mount

  function calculateFontSize() {
    // Adjust this logic based on your requirements
    const windowWidth = window.innerWidth;
    const minFontSize = 60;
    const maxFontSize = 262;

    // Calculate the font size based on window dimensions or any other logic
    const calculatedFontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, windowWidth / 4),
    );

    return calculatedFontSize;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        fontSize: fontSize,
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          margin: "5px",
          fontSize: fontSize / 7,
          color: "#D1D0C5",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
        }}
      >
        Get ready
      </Box>
      <Box
        sx={{
          fontSize: fontSize,
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          color: "#D1D0C5",
          width: "400px", // 40% of the viewport width
          height: "400px", // 40% of the viewport height
        }}
      >
        {count}
      </Box>
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "light",
          fontSize: fontSize / 12,
          color: "#D1D0C5",
        }}
      >
        {mode === ADAPTIVE_MODE
          ? "Tip: Use the SPACE key to pause the game."
          : "Tip: Tap ↑ ↓ to control wpm."}
      </Box>
    </Box>
  );
};

export default CountdownComponent;
