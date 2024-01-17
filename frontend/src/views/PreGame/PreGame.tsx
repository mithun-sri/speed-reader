import "./PreGame.css";
import React, { useState } from 'react';
import CountdownComponent from "../../components/Counter/Counter";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";

const PreGameView = () => {
  const [wpm, setWPM] = useState<number>(2);

  return (
    <div className="PreGame">
      <Header />
      <header className="PreGame-header">
        <CountdownComponent duration={3} />
        <SpeedSlider updateValue={setWPM}/>
        <Footer />
      </header>
    </div>
  );
}

export default PreGameView;
