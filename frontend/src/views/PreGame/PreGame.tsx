import StartButton from "../../components/Button/StartButton";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";
import { useGameContext } from "../../context/GameContext";
import "./PreGame.css";

const PreGameView = () => {
  const { mode } = useGameContext();
  return (
    <div className="PreGame">
      <Header />
      <SpeedSlider />
      <StartButton />
    </div>
  );
};

export default PreGameView;
