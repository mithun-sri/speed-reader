import "./PreGame.css";
import CountdownComponent from "../../components/Counter/Counter";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";

const PreGameView = () => {
  return (
    <div className="PreGame">
      <Header />
      <header className="PreGame-header">
        <CountdownComponent duration={3} />
        <SpeedSlider />
        <Footer />
      </header>
    </div>
  );
}

export default PreGameView;
