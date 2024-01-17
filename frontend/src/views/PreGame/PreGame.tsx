import "./PreGame.css";
import { useState } from 'react';
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";

const PreGameView = () => {
  const [wpm, setWPM] = useState<number>(2);

  return (
    <div className="PreGame">
      <Header />
      <SpeedSlider updateValue={setWPM}/>
      <Footer />
    </div>
  );
}

export default PreGameView;
