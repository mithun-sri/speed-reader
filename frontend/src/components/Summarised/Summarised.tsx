import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import clickAudio from "../../common/audio";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";

const SummarisedSelect = () => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { setSummarised, setDifficulty } = useGameContext();

  const [fontSize, setFontSize] = useState(calculateFontSize());

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
    const windowWidth = window.innerWidth;
    const minFontSize = 40;
    const maxFontSize = 200;

    const calculatedFontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, windowWidth / 6),
    );

    return calculatedFontSize;
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1.5,
      }}
    >
      <Box
        onClick={() => {
          clickAudio.play();
          // set summarised (and set difficulty to null)
          setSummarised(true);
          setDifficulty(null);

          incrementCurrentStage();
        }}
        sx={{
          fontSize: fontSize / 3.5,
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          cursor: "pointer",
        }}
      >
        Summarised
      </Box>
      <Box
        sx={{
          fontSize: fontSize / 10,
          fontFamily: "JetBrains Mono, monospace",
          color: "#FFFFFF",
          width: "60%",
        }}
      >
        Explore some summarised non-fiction texts to enhance your reading
        comprehension.
      </Box>
    </Box>
  );
};

export default SummarisedSelect;
