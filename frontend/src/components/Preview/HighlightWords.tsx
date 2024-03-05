import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import clickAudio from "../../common/audio";
import { GameViewType, useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";
import GameProgressBar from "../ProgressBar/GameProgressBar";
import ModeDescriptionComponent from "./ModeDescription";

const HighlightWordsPreview: React.FC<{
  text: string;
}> = ({ text }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { setView } = useGameContext();

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
    }, 60000 / 300);
    return () => {
      clearInterval(interval);
    };
  }, [text, wordIndex, words.length]);

  return (
    <IconButton
      onClick={() => {
        clickAudio.play();
        setView(GameViewType.StandardHighlighted);
        incrementCurrentStage();
      }}
    >
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
              width: "70%",
              paddingLeft: "20px",
              fontSize: fontSize / 5,
              margin: fontSize / 17,
              color: "#646669",
              fontFamily: "JetBrains Mono, monospace",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {text.split(" ").map((word, index) => (
              <Box
                key={index}
                sx={{
                  marginRight: "0.5em",
                  fontWeight: "bolder",
                  color: index <= wordIndex ? "#E2B714" : "#646669",
                }}
              >
                {word}
              </Box>
            ))}
          </Box>
          <Box sx={{ width: "60%" }}>
            <GameProgressBar
              gameProgress={(wordIndex / (words.length - 1)) * 100}
            />
          </Box>
        </Box>
        <ModeDescriptionComponent
          mode="Highlight Words"
          description="Presents text with words highlighted at a set rate, encouraging consistent reading pace."
        />
      </Box>
    </IconButton>
  );
};

export default HighlightWordsPreview;
