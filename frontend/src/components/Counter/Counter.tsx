import "@fontsource/jetbrains-mono";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { STANDARD_MODE_1 } from "../../common/constants";

const CountdownComponent: React.FC<{
  duration: number;
  mode?: string;
  onCountdownFinish?: () => void;
}> = ({ duration, mode, onCountdownFinish }) => {
  const [count, setCount] = useState(duration);
  const [fontSize, setFontSize] = useState(calculateFontSize());

  // Change instruction text according to the mode
  let instruction: string = "read as many words as you can.";
  if (mode === STANDARD_MODE_1) {
    instruction = "get ready."
  }

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (count === 0) {
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
      Math.max(minFontSize, windowWidth / 4)
    );

    return calculatedFontSize;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column", // Stack items vertically
        justifyContent: "center",
        alignItems: "center",
        fontSize: fontSize,
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
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
        {instruction}
      </Box>
      <Box
        sx={{
          width: "400px", // 40% of the viewport width
          height: "400px", // 40% of the viewport height
        }}
      >
        <Typography
          variant="h1"
          color={"#D1D0C5"}
          sx={{
            fontSize: fontSize,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bolder",
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  );
};

export default CountdownComponent;
