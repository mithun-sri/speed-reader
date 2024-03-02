import {
  IconDefinition,
  faBookReader,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import clickAudio from "../../common/audio";
import { ADAPTIVE_MODE, GameMode, STANDARD_MODE } from "../../common/constants";
import Header from "../../components/Header/Header";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";
import "./ModeSelect.css";

const ModeSelectView = () => {
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
              width: "85%",
              height: "70vh",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: "bolder",
                fontSize: fontSize / 6.3,
                color: "#D1D0C5",
              }}
            >
              {"choose game mode"}
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                width: "70%",
                gap: "7vw",
              }}
            >
              <ModeSelectContainer>
                <StandardCard size={fontSize} />
              </ModeSelectContainer>
              <ModeSelectContainer>
                <AdaptiveCard size={fontSize} />
              </ModeSelectContainer>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

const ModeCard: React.FC<{
  size?: number;
  mode: GameMode;
  description: string;
  icon: IconDefinition;
  onClick: () => void;
}> = ({ size, mode, description, icon, onClick }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { setMode } = useGameContext();

  return (
    <Box
      onClick={() => {
        onClick();
        clickAudio.play();
        setMode(mode);
        incrementCurrentStage(mode);
      }}
      sx={{
        backgroundColor: "rgba(0,0,0,0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        gap: 1.5,
        padding: "40px 50px",
        height: "350px",
        "@media (max-width: 1200px)": {
          height: "37vw", // Decrease height for smaller screens
        },
      }}
    >
      <Box
        sx={{
          fontSize: (size || 20) / 4,
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          cursor: "pointer",
        }}
      >
        {mode === STANDARD_MODE ? "Standard" : "Adaptive"}
      </Box>
      <Box sx={{ fontSize: (size || 20) / 2 }}>
        <FontAwesomeIcon icon={icon} color="#E2B714" />
      </Box>
      <Box
        sx={{
          fontSize: (size || 20) / 10,
          fontFamily: "JetBrains Mono, monospace",
          color: "#FFFFFF",
          width: "90%",
        }}
      >
        {description}
      </Box>
    </Box>
  );
};

const StandardCard: React.FC<{ size?: number }> = ({ size }) => {
  return (
    <ModeCard
      size={size}
      mode={STANDARD_MODE}
      description="Choose a fixed words-per-minute (WPM) rate that suits you best. Great for getting started with speed reading!"
      icon={faBookReader}
      onClick={() => {}}
    />
  );
};

const AdaptiveCard: React.FC<{ size?: number }> = ({ size }) => {
  return (
    <ModeCard
      size={size}
      mode={ADAPTIVE_MODE}
      description="Experience reading that adjusts to your pace in real-time with our Adaptive Mode. Powered by WebGazer's eye tracking technology."
      icon={faEye}
      onClick={() => {}}
    />
  );
};

export const ModeSelectContainer: React.FC<{
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
        border: "2px solid #646669",
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

export default ModeSelectView;
