import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";
import Calibration from "./Calibration";

declare const webgazer: any;

const WebGazerLoader = () => {
  const { setGazeX, setGazeY } = useGameContext();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.async = true;

    const handleScriptLoad = async () => {
      await webgazer.clearData();

      await webgazer
        .setRegression("ridge")
        .setGazeListener((data: any, _clock: any) => {
          if (data == null) {
            return;
          }
          const bound_data = webgazer.util.bound(data);
          setGazeX(bound_data.x);
          setGazeY(bound_data.y);
        })
        .saveDataAcrossSessions(true)
        .begin();

      await webgazer
        .showPredictionPoints(true)
        .showVideoPreview(true)
        .applyKalmanFilter(true);
    };

    script.addEventListener("load", handleScriptLoad);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
      document.body.removeChild(script);
    };
  }, [setGazeX, setGazeY]);

  const turnOffCam = async () => {
    console.log("turnOffCam");
    await webgazer.showVideoPreview(false);
  };

  const webgazerRestart = async () => {
    console.log("webgazerRestart");
    await webgazer.clearData();
  };

  const handleEnd = async () => {
    console.log("handleEnd");
    await webgazer.end();
  };

  return (
    <Calibration
      restartWebgazerMethod={webgazerRestart}
      endWedgazerMethod={handleEnd}
      turnOffCam={turnOffCam}
    />
  );
};

export default WebGazerLoader;
