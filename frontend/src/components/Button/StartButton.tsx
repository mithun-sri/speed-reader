import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";

const StartButton = () => {
  const { incrementCurrentStage } = useGameScreenContext();
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

  function calculateFontSize() {
    const windowWidth = window.innerWidth;
    const minSize = 12;
    const maxSize = 36;
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 15),
    );
    return calculatedSize;
  }

  return (
    <IconButton
      onClick={() => {
        incrementCurrentStage();
      }}
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        color: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          border: "10px solid #646669",
          borderRadius: "30px",
          background: "#E2B714",
          padding: "7px 40px 7px 40px",
          fontWeight: "bolder",
          fontSize: fontSize * 1,
        }}
      >
        Start
      </Box>
    </IconButton>
  );
};

export default StartButton;
