import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BackButton from "../../components/Button/BackButton";
import Header from "../../components/Header/Header";
import HighlightWordsPreview from "../../components/Preview/HighlightWords";
import PeripheralPreview from "../../components/Preview/Peripheral";
import WordByWordPreview from "../../components/Preview/WordByWord";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const StandardSubModeView = () => {
  const { decrementCurrentStage } = useGameScreenContext();
  const previewText =
    "Is this a dagger which I see before me, The handle toward my hand? Come, let me clutch thee. I have thee not, and yet I see thee still.";
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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <Box>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px" }}>
        <BackButton label="difficulty" handleClick={decrementCurrentStage} />
      </Box>
      <Box
        sx={{
          marginTop: "30px",
          color: "#D1D0C5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: fontSize / 1.5,
          fontWeight: "bold",
          marginBottom: fontSize / 8,
        }}
      >
        choose your view
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
          }}
        >
          <WordByWordPreview text={previewText} />
          <Box sx={{ width: "5vw" }} />
          <HighlightWordsPreview text={previewText} />
          <Box sx={{ width: "5vw" }} />
          <PeripheralPreview text={previewText} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default StandardSubModeView;
