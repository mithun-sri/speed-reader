import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CountdownComponent from "../../components/Counter/Counter";
import { STANDARD_MODE_1 } from "../../common/constants";
import "./StandardMode.css";

import { useState } from "react";

function StandardModeGame() {
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

  let standardGameComp = (
    <>
      <div>TODO: IMPLEMENT STANDARD GAME SCREEN HERE. </div>
    </>
  );

  return (
    <div>
      <Header />
      {showGameScreen ? standardGameComp : countdownComp}
      <Footer />
    </div>
  );
}

export default StandardModeGame;
