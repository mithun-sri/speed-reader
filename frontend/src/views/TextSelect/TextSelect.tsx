import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import BackButton from "../../components/Button/BackButton";
import Header from "../../components/Header/Header";
import OriginalSelect from "../../components/Summarised/OriginalSelect";
import SummarisedSelect from "../../components/Summarised/Summarised";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const TextSelect = () => {
  const { decrementCurrentStage } = useGameScreenContext();
  const { setSummarised, setDifficulty } = useGameContext();

  const handleBackButton = () => {
    setSummarised(false);
    setDifficulty(null);
    decrementCurrentStage();
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px", marginBottom: "0px" }}>
        <BackButton label="mode" handleClick={handleBackButton} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "70vh",
              paddingBottom: "20px",
            }}
          >
            <Box
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: "bolder",
                fontSize: fontSize / 6.3,
                color: "#D1D0C5",
                justifySelf: "flex-start",
                marginBottom: "4vh",
              }}
            >
              {"choose text type"}
            </Box>
            <TextSelectContainer>
              <OriginalSelect size={fontSize} />
            </TextSelectContainer>
            <TextSelectContainer>
              <SummarisedSelect size={fontSize} />
            </TextSelectContainer>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

const TextSelectContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Box
    sx={{
      width: "80%",
      maxWidth: "900px",
    }}
  >
    <Box
      sx={{
        borderRadius: "40px",
        marginBottom: "6vh",
        border: "2px solid #646669",
        minHeight: "20px",
        boxSizing: "border-box",
        color: "#646669",
        "&:hover": {
          backgroundColor: "#303236",
          color: "#E2B714",
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

// eslint-disable-next-line
const HorizontalLineWithText = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        gap: 3,
      }}
    >
      <Box
        sx={{
          height: "2px",
          width: "50%",
          backgroundColor: "#D1D0C5",
        }}
      />
      <Box
        sx={{
          fontSize: "3.5vw",
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          color: "#D1D0C5",
        }}
      >
        or
      </Box>
      <Box
        sx={{
          width: "50%",
          height: "2px",
          backgroundColor: "#D1D0C5",
        }}
      />
    </Box>
  );
};

export default TextSelect;
