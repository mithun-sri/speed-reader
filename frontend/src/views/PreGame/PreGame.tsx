import "./PreGame.css";
import { useState } from 'react';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";
import StartButton from "../../components/Button/StartButton";

const PreGameView = () => {
  const [wpm, setWPM] = useState<number>(300);

  return (
    <div className="PreGame">
      <Header />
      <SpeedSlider updateValue={setWPM}/>
      <StartButton />
      <Footer />
    </div>
  );
}

export default PreGameView;
