import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CountdownComponent from "../../components/Counter/Counter";
import { STANDARD_MODE_1 } from "../../common/constants";
import "./StandardMode.css";

import { useNavigate } from 'react-router-dom';

function StandardModeGame() {
  // const navigate = useNavigate();

  const startStandardModeGame = () => {
    // TODO: Need routing path from mode selection page
    // navigate(/path-to-standard-game)
  };

  return (
    <div>
      <Header />
      <CountdownComponent
        duration={3} 
        mode={STANDARD_MODE_1}
        onCountdownFinish={startStandardModeGame}
        />
      <Footer />
    </div>
  );
}

export default StandardModeGame;