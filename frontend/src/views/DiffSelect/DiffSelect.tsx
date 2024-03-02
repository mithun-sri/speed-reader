import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASY, GameDifficulty, HARD, MED } from "../../common/constants";
import Carousel from "../../components/Carousel/Carousel";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const DiffSelect = () => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { difficulty, setDifficulty, setSummarised } = useGameContext();
  const [valueFromCarousel, setValueFromCarousel] = useState<number>(-1); // To retrieve selected index from Carousel

  const options: GameDifficulty[] = [EASY, MED, HARD];

  // Callback function to handle the selected index form the Carousel
  const handleValueFromCarousel = (value: number) => {
    setValueFromCarousel(value);
  };

  // setDiff according to the selected index from options
  // and setSummarised to false
  useEffect(() => {
    if (valueFromCarousel >= 0 && valueFromCarousel < options.length) {
      setDifficulty(options[valueFromCarousel]);
      setSummarised(false);
      incrementCurrentStage(); // Go to the next view in GameScreen
    }
  }, [valueFromCarousel, setDifficulty]);

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0)",
        marginTop: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
      }}
    >
      <AnimatePresence>
        <motion.div
          key={"mode_select"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          exit={{ opacity: 0 }}
        >
          <Carousel
            title="Choose text difficulty"
            options={options}
            returnSelectedIndex={handleValueFromCarousel}
            defaultIdx={
              difficulty !== null ? options.indexOf(difficulty) : undefined
            }
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default DiffSelect;
