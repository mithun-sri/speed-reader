import { Box, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ADAPTIVE_MODE, GameMode, STANDARD_MODE } from "../../common/constants";
import BackButton from "../../components/Button/BackButton";
import Header from "../../components/Header/Header";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const SummarizedSubMode: React.FC = () => {
  const { incrementCurrentStage, decrementCurrentStage } =
    useGameScreenContext();
  const { setMode, setSummarised } = useGameContext();
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
    const minFontSize = 40;
    const maxFontSize = 200;

    const calculatedFontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, windowWidth / 6),
    );

    return calculatedFontSize;
  }

  function setSummarisedSubMode(submode: GameMode) {
    setSummarised(true);
    setMode(submode);
    incrementCurrentStage();
  }

  const handleBackButton = () => {
    setSummarised(false);
    decrementCurrentStage();
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px", marginBottom: "0px" }}>
        <BackButton label="mode" handleClick={handleBackButton} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bolder",
            paddingTop: "20px",
            fontSize: fontSize / 6.3,
            color: "#D1D0C5",
          }}
        >
          choose submode.
        </Box>
        <motion.div
          initial="hidden"
          animate={"visible"}
          variants={fadeInVariants}
          transition={{ duration: 1.5 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
              height: "40vh",
            }}
          >
            <IconButton
              sx={{
                fontWeight: "bolder",
                fontFamily: "JetBrains Mono, monospace",
                color: "#646669",
                fontSize: "3.6vw",
                padding: "0px 5vw",
                "&:hover": { color: "#E2B714" },
              }}
              disableFocusRipple
              disableRipple
              onClick={setSummarisedSubMode.bind(this, STANDARD_MODE)}
            >
              <Box>
                Standard <br /> Mode
              </Box>
            </IconButton>
            <IconButton
              sx={{
                fontWeight: "bolder",
                fontFamily: "JetBrains Mono, monospace",
                color: "#646669",
                fontSize: "3.6vw",
                padding: "0px 5vw",
                "&:hover": { color: "#E2B714" },
              }}
              disableFocusRipple
              disableRipple
              onClick={setSummarisedSubMode.bind(this, ADAPTIVE_MODE)}
            >
              <Box>
                Adaptive <br /> Mode
              </Box>
            </IconButton>
          </Box>
        </motion.div>
      </Box>
    </>
  );
};

export default SummarizedSubMode;
