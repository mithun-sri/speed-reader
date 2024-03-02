import React, { createContext, useContext, useState } from "react";

interface WebGazerContextType {
  webGazerInitialised: boolean;
  setwebGazerInitialised: (webGazerInitialised: boolean) => void;
  needsCalibration: boolean;
  setNeedsCalibration: (needsCalibration: boolean) => void;
  manualRecalibration: boolean;
  setManualRecalibration: (manualRecalibration: boolean) => void;
  initialiseWebGazer: () => void;
  endWebGazer: () => void;
  restartWebGazer: () => void;
  turnOffWebGazerCam: () => void;
  turnOffPredictionPoints: () => void;
  enableWebGazerListener: () => void;
  disableWebGazerListener: () => void;
  pauseWebGazer: () => void;
  resumeWebGazer: () => void;
  gazeX: number;
  setGazeX: (x: number) => void;
  gazeY: number;
  setGazeY: (y: number) => void;
}

const WebGazerContext = createContext<WebGazerContextType>({
  // used for webgazer initialisation and maintaining state
  webGazerInitialised: false,
  setwebGazerInitialised: () => {},
  needsCalibration: false,
  setNeedsCalibration: () => {},
  manualRecalibration: false,
  setManualRecalibration: () => {},
  initialiseWebGazer: () => {},
  endWebGazer: () => {},
  restartWebGazer: () => {},
  turnOffWebGazerCam: () => {},
  turnOffPredictionPoints: () => {},
  enableWebGazerListener: () => {},
  disableWebGazerListener: () => {},
  pauseWebGazer: () => {},
  resumeWebGazer: () => {},

  // gaze_x and gaze_y are only for ADAPTIVE_MODE
  gazeX: 0,
  setGazeX: () => {},
  gazeY: 0,
  setGazeY: () => {},
});

export const useWebGazerContext = () => {
  const context = useContext(WebGazerContext);
  if (!context) {
    throw new Error(
      "useWebGazerContext must be used within a WebGazerContext.Provider",
    );
  }
  return context;
};

// This provides the game context, which manages
// the state related to the game mode, words per minute (WPM), and difficulty level.
export const WebGazerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [webGazerInitialised, setwebGazerInitialised] =
    useState<boolean>(false);
  const [needsCalibration, setNeedsCalibration] = useState<boolean>(false);
  const [manualRecalibration, setManualRecalibration] =
    useState<boolean>(false);
  const [gazeX, setGazeX] = useState<number>(0);
  const [gazeY, setGazeY] = useState<number>(0);

  const initialiseWebGazer = async () => {
    if (
      webGazerInitialised ||
      document.querySelector(
        'script[src="https://webgazer.cs.brown.edu/webgazer.js"]',
      )
    ) {
      const webgazer = (window as any).webgazer;
      if (webgazer !== undefined) {
        await restartWebGazer();
        await resumeWebGazer();
        await turnOnWebGazerCam();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://webgazer.cs.brown.edu/webgazer.js";
    script.async = true;

    script.onload = async () => {
      const webgazer = (window as any).webgazer;
      if (webgazer === undefined) {
        console.error("WebGazer not loaded correctly.");
        return;
      }

      await webgazer
        .setRegression("ridge")
        .setGazeListener((data: any, _: any) => {
          if (data == null) return;
          setGazeX(data.x);
          setGazeY(data.y);
        })
        .saveDataAcrossSessions(true)
        .begin();

      await webgazer
        .showPredictionPoints(true)
        .showVideoPreview(true)
        .applyKalmanFilter(true);

      setwebGazerInitialised(true);
    };

    document.body.appendChild(script);
  };

  const endWebGazer = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.end();
      setwebGazerInitialised(false);
    }
  };

  const restartWebGazer = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.clearData();
    }
  };

  const pauseWebGazer = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.pause();
    }
  };

  const resumeWebGazer = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.resume();
    }
  };

  const turnOffWebGazerCam = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.showVideoPreview(false);

      const videoContainer = document.getElementById("webgazerVideoContainer");
      if (videoContainer) {
        videoContainer.style.display = "none";
        videoContainer.style.pointerEvents = "none";
      }
    }
  };

  const turnOnWebGazerCam = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.showVideoPreview(true);

      const videoContainer = document.getElementById("webgazerVideoContainer");
      if (videoContainer) {
        videoContainer.style.display = "block";
        videoContainer.style.pointerEvents = "auto";
      }
    }
  };

  const turnOffPredictionPoints = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.showPredictionPoints(false);
    }
  };

  const enableWebGazerListener = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.setGazeListener((data: any, _: any) => {
        if (data == null) return;
        setGazeX(data.x);
        setGazeY(data.y);
      });
    }
  };

  const disableWebGazerListener = async () => {
    const webgazer = (window as any).webgazer;
    if (webgazer !== undefined) {
      await webgazer.clearGazeListener();
    }
  };

  return (
    <WebGazerContext.Provider
      value={{
        webGazerInitialised,
        setwebGazerInitialised,
        needsCalibration,
        setNeedsCalibration,
        manualRecalibration,
        setManualRecalibration,
        initialiseWebGazer,
        endWebGazer,
        restartWebGazer,
        turnOffWebGazerCam,
        turnOffPredictionPoints,
        enableWebGazerListener,
        disableWebGazerListener,
        pauseWebGazer,
        resumeWebGazer,
        gazeX,
        setGazeX,
        gazeY,
        setGazeY,
      }}
    >
      {children}
    </WebGazerContext.Provider>
  );
};
