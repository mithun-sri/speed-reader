import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CountdownComponent from "../../components/Counter/Counter";
import { STANDARD_MODE_1 } from "../../common/constants";
import "./StandardMode.css";

import { useState } from "react";

const StandardModeGameComponent = () => {
  return (
    <>
      <div>TODO: IMPLEMENT STANDARD GAME SCREEN HERE. </div>
    </>
  );
};

function StandardModeGameView() {
  const [showGameScreen, setShowGameScreen] = useState(false);

  const startStandardModeGame = () => {
    setShowGameScreen(true);
  };

  let countdownComp = (
    <>
      <CountdownComponent
        duration={3}
        mode={STANDARD_MODE_1}
        onCountdownFinish={startStandardModeGame}
      />
    </>
  );

  return (
    <div>
      <Header />
      {showGameScreen ? <StandardModeGameComponent /> : countdownComp}
      <Footer />
    </div>
  );
}

export default StandardModeGameView;
