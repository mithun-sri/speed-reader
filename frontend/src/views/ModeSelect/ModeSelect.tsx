import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ADAPTIVE_MODE,
  GameMode,
  STANDARD_MODE,
  SUMMARISED_MODE,
} from "../../common/constants";
import Carousel from "../../components/Carousel/Carousel";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";
import "./ModeSelect.css";
import { AnimatePresence, motion } from "framer-motion";

const ModeSelectView = () => {
  const { incrementCurrentStage } = useGameScreenContext(); // This is possible because Carousel is only used within a GameScreenContext
  const { mode, setMode } = useGameContext();
  const [valueFromCarousel, setValueFromCarousel] = useState<number>(-1); // To retrieve selected index from Carousel

  const options: GameMode[] = [STANDARD_MODE, ADAPTIVE_MODE, SUMMARISED_MODE];

  // Callback function to handle the selected index form the Carousel
  const handleValueFromCarousel = (value: number) => {
    setValueFromCarousel(value);
  };

  // setMode according to the selected index from options
  useEffect(() => {
    if (valueFromCarousel >= 0 && valueFromCarousel < options.length) {
      const new_mode = options[valueFromCarousel];
      setMode(new_mode);
      incrementCurrentStage(new_mode); // Go to the next view in GameScreen
    }
  }, [valueFromCarousel, setMode]);

  return (
    <div className="ModeSelect">
      <Header />
      <Box sx={{ marginTop: "85px" }} />
      <header className="ModeSelect-header">
        <AnimatePresence>
          <motion.div
            key={"mode_select"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0 }}
          >
            <Carousel
              title="choose game mode."
              options={options}
              returnSelectedIndex={handleValueFromCarousel}
              defaultIdx={mode !== null ? options.indexOf(mode) : undefined}
            />
          </motion.div>
        </AnimatePresence>
        <Footer />
      </header>
    </div>
  );
};

export default ModeSelectView;
