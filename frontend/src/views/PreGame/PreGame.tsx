import "./PreGame.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";
import StartButton from "../../components/Button/StartButton";

const PreGameView = () => {
  return (
    <div className="PreGame">
      <Header />
      <SpeedSlider />
      <StartButton />
      <Footer />
    </div>
  );
}

export default PreGameView;
