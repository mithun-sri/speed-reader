import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { EASY, GameDifficulty, HARD, MED } from "../../common/constants";
import BackButton from "../../components/Button/BackButton";
import Carousel from "../../components/Carousel/Carousel";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const DiffSelect = () => {
  const { incrementCurrentStage, decrementCurrentStage } =
    useGameScreenContext();
  const { difficulty, setDifficulty } = useGameContext();
  const [valueFromCarousel, setValueFromCarousel] = useState<number>(-1); // To retrieve selected index from Carousel

  const options: GameDifficulty[] = [EASY, MED, HARD];

  const handleBackButton = () => {
    setDifficulty(null);
    decrementCurrentStage();
  };

  // Callback function to handle the selected index form the Carousel
  const handleValueFromCarousel = (value: number) => {
    setValueFromCarousel(value);
  };

  // setMode according to the selected index from options
  useEffect(() => {
    if (valueFromCarousel >= 0 && valueFromCarousel < options.length) {
      setDifficulty(options[valueFromCarousel]);
      incrementCurrentStage(); // Go to the next view in GameScreen
    }
  }, [valueFromCarousel, setDifficulty]);

  return (
    <Box>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px" }}>
        <BackButton label="mode" handleClick={handleBackButton} />
      </Box>
      <Box
        sx={{
          backgroundColor: "#2c2e31",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
        }}
      >
        <Carousel
          title="choose text difficulty."
          options={options}
          returnSelectedIndex={handleValueFromCarousel}
          defaultIdx={
            difficulty !== null ? options.indexOf(difficulty) : undefined
          }
        />
        <Footer />
      </Box>
    </Box>
  );
};

export default DiffSelect;
