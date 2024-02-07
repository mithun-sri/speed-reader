import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";
import { StandardView } from "../../views/StandardMode/StandardMode";
import GameProgressBar from "../ProgressBar/GameProgressBar";
import ModeDescriptionComponent from "./ModeDescription";
import clickAudio from "../../common/audio";
import { motion } from "framer-motion";

const PeripheralPreview: React.FC<{
  text: string;
}> = ({ text }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { setView } = useGameContext();

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

  const [seconds, setSeconds] = useState(0);
  const duration = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds >= duration) {
          return 0;
        }
        return prevSeconds + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <IconButton
      onClick={() => {
        clickAudio.play();
        setView(StandardView.Peripheral);
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
              fontSize: fontSize / 5,
              margin: fontSize / 25,
              color: "#646669",
              fontFamily: "JetBrains Mono, monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <motion.p
              initial={{ translateY: 50, opacity: 0.7 }}
              animate={{ translateY: "-60px", opacity: 1 }}
              transition={{
                duration: duration + 0.205,
                repeat: Infinity,
                repeatDelay: 0,
                ease: "easeInOut",
              }}
              style={{
                fontSize: fontSize / 5,
                fontFamily: "JetBrains Mono, monospace",
                color: "#D1D0C5",
                alignItems: "left",
                fontWeight: "bolder",
                display: "flex",
                justifyContent: "left",
                alignContent: "left",
                textAlign: "left",
                bottom: 0,
              }}
            >
              {text}
            </motion.p>
          </Box>
          <Box sx={{ width: "60%" }}>
            <GameProgressBar gameProgress={(seconds / duration) * 100} />
          </Box>
        </Box>
        <ModeDescriptionComponent
          mode="Peripheral"
          description="description more useful description amd more useful description"
        />
      </Box>
    </IconButton>
  );
};

export default PeripheralPreview;