import { useEffect, useState } from "react";
import {
  ADAPTIVE_MODE,
  GameMode,
  STANDARD_MODE,
  SUMMARISED_ADAPTIVE_MODE,
} from "../../common/constants";
import Carousel from "../../components/Carousel/Carousel";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";
import "./ModeSelect.css";

const ModeSelectView = () => {
  const { incrementCurrentStage } = useGameScreenContext(); // This is possible because Carousel is only used within a GameScreenContext
  const { setMode } = useGameContext();
  const [valueFromCarousel, setValueFromCarousel] = useState<number>(-1); // To retrieve selected index from Carousel

  const options: GameMode[] = [
    STANDARD_MODE,
    ADAPTIVE_MODE,
    SUMMARISED_ADAPTIVE_MODE,
  ];

  // Callback function to handle the selected index form the Carousel
  const handleValueFromCarousel = (value: number) => {
    setValueFromCarousel(value);
  };

  // setMode according to the selected index from options
  useEffect(() => {
    if (valueFromCarousel >= 0 && valueFromCarousel < options.length) {
      setMode(options[valueFromCarousel]);
      incrementCurrentStage(); // Go to the next view in GameScreen
    }
  }, [valueFromCarousel, setMode]);

  return (
    <div className="ModeSelect">
      <Header />
      <header className="ModeSelect-header">
        <Carousel
          title="choose game mode."
          options={options}
          returnSelectedIndex={handleValueFromCarousel}
        />
        <Footer />
      </header>
    </div>
  );
};

export default ModeSelectView;
