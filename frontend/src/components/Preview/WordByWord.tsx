import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import GameProgressBar from "../ProgressBar/GameProgressBar";
import ModeDescriptionComponent from "./ModeDescription";

const WordByWordPreview: React.FC<{
  text: string;
}> = ({ text }) => {
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 16;
    const maxFontSize = 48;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
  };

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

  useEffect(() => {
    const wordsArray: string[] = text.split(" ");
    setWords(wordsArray);

    const interval = setInterval(() => {
      if (wordIndex < words.length - 1) {
        setWordIndex((prevIndex) => prevIndex + 1);
      } else {
        setWordIndex(0);
      }
    }, 60000 / 160);
    return () => {
      clearInterval(interval);
    };
  }, [text, wordIndex, words.length]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1%",
      }}
    >
      <Box
        sx={{
          width: fontSize * 6.5,
          height: fontSize * 3.2,
          borderRadius: "20px",
          border: "4px solid #646669",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
            margin: fontSize / 10,
            fontWeight: "bolder",
            fontFamily: "JetBrains Mono, monospace",
            color: "#646669",
            fontSize: fontSize / 5,
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              minWidth: "20px",
              marginRight: fontSize / 8,
            }}
          >
            {wordIndex - 1 < 0 ? "" : words[wordIndex - 1]}
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              color: "#E2B714",
              minWidth: "35px",
              fontSize: fontSize / 4,
            }}
          >
            {words[wordIndex]}
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              minWidth: "20px",
              marginLeft: fontSize / 8,
            }}
          >
            {wordIndex === words.length ? "" : words[wordIndex + 1]}
          </Box>
        </Box>
        <Box sx={{ width: "60%" }}>
          <GameProgressBar
            gameProgress={(wordIndex / (words.length - 1)) * 100}
          />
        </Box>
      </Box>
      <ModeDescriptionComponent
        mode="Word by Word"
        description="description more useful description amd more useful description"
      />
    </Box>
  );
};

export default WordByWordPreview;
