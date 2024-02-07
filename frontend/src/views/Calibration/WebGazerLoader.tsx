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
        .showPredictionPoints(false)
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
    //await webgazer.showVideoPreview(false);
    document
      .getElementById("webgazerVideoContainer")
      ?.style.setProperty("z-index", "-1");
    document
      .getElementById("webgazerVideoContainer")
      ?.style.setProperty("opacity", "0");
  };

  const webgazerRestart = async () => {
    await webgazer.clearData();
  };

  const handleEnd = async () => {
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
