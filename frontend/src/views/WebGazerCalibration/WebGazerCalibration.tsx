import { Box, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { GameScreenContext } from "../GameScreen/GameScreen";
import "./WebGazerCalibration.css";

const WebGazerCalibration = () => {
  const {
    initialiseWebGazer,
    turnOffWebGazerCam,
    turnOffPredictionPoints,
    webGazerInitialised,
    manualRecalibration,
    setManualRecalibration,
    setCalibratedBefore,
    pauseWebGazer,
  } = useWebGazerContext();
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [pointCalibrate, setPointCalibrate] = useState(0);
  const [clickCounts, setClickCounts] = useState({
    Pt1: 0,
    Pt2: 0,
    Pt3: 0,
    Pt4: 0,
    Pt5: 0,
    Pt6: 0,
    Pt7: 0,
    Pt8: 0,
    Pt9: 0,
  });

  useEffect(() => {
    const handleLoad = () => {
      initialiseWebGazer();
      canvasSetup();
      docLoad();
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      turnOffWebGazerCam();
      turnOffPredictionPoints();
      pauseWebGazer();
    };
  }, []);

  const docLoad = () => {
    clearCanvas();
    document
      .getElementById("calibration_done")
      ?.style.setProperty("display", "none");
    document
      .getElementById("calibration_in_progress")
      ?.style.setProperty("display", "block");
  };

  const canvasSetup = () => {
    const canvas = document.getElementById(
      "plotting_canvas",
    ) as HTMLCanvasElement;
    if (canvas === null) {
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (canvas) {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    let noPointsCalibrated = 0;

    for (const node in clickCounts) {
      const nodeId = node as keyof typeof clickCounts;
      if (clickCounts[nodeId] >= 5) {
        noPointsCalibrated++;
      }
    }

    setPointCalibrate(noPointsCalibrated);
  }, [clickCounts]);

  useEffect(() => {
    if (pointCalibrate === 8) {
      document
        .getElementById("calibration_in_progress")
        ?.style.setProperty("display", "none");
      document.getElementById("Pt5")?.style.removeProperty("display");
      turnOffWebGazerCam();
    } else if (pointCalibrate >= 9) {
      setCalibratedBefore(true);

      if (manualRecalibration) {
        setManualRecalibration(false);
        navigate("/");
      } else {
        document.querySelectorAll(".CalibrationButton").forEach((i) => {
          if (i instanceof HTMLElement) {
            i.style.setProperty("display", "none");
          }
        });
        document
          .getElementById("calibration_done")
          ?.style.setProperty("display", "block");
        clearCanvas();
      }
    }
  }, [pointCalibrate]);

  const incPointClick = (node: any) => {
    const nodeId = node.id as keyof typeof clickCounts;
    setClickCounts((prevState) => {
      return { ...prevState, [nodeId]: prevState[nodeId] + 1 };
    });
  };

  return (
    <GameScreenContext.Consumer>
      {(context) => (
        <div id="container">
          <canvas
            ref={canvasRef}
            id="plotting_canvas"
            width={500}
            height={500}
            style={{ cursor: "crosshair" }}
          />

          {!webGazerInitialised && (
            <div className="loading-text">
              <JetBrainsMonoText
                text={"Loading..."}
                size={35}
                color="#D1D0C5"
              />
            </div>
          )}

          {webGazerInitialised && (
            <div className="calibrationDiv">
              {Object.keys(clickCounts).map((pointId) => {
                const validPointId = pointId as keyof typeof clickCounts;

                return (
                  <button
                    key={pointId}
                    className="CalibrationButton"
                    id={pointId}
                    onClick={() => {
                      incPointClick(document.getElementById(pointId));
                    }}
                    disabled={clickCounts[validPointId] >= 5}
                    style={{
                      opacity: (
                        0.2 *
                        (clickCounts[validPointId] + 1)
                      ).toString(),
                      backgroundColor:
                        clickCounts[validPointId] >= 5 ? "#E2B714" : "#D1D0C5",
                      display: pointId === "Pt5" ? "none" : "block",
                    }}
                  />
                );
              })}
            </div>
          )}

          {webGazerInitialised && (
            <div
              id="calibration_in_progress"
              className="calibration-in-progress"
            >
              <div>
                <JetBrainsMonoText
                  text={"Calibration in progress."}
                  size={35}
                  color="#D1D0C5"
                />
              </div>
              <div className="instructions_text">
                <JetBrainsMonoText
                  text={"Stare at each circle and click until it turns yellow."}
                  size={25}
                  color="#D1D0C5"
                />
              </div>
            </div>
          )}

          <div id="calibration_done" className="calibration-done">
            <JetBrainsMonoText
              text={"Calibration done!"}
              size={45}
              color="#D1D0C5"
            />
            <IconButton
              onClick={() => {
                context.incrementCurrentStage();
              }}
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                color: "#FFFFFF",
              }}
              style={{ zIndex: 10 }}
            >
              <Box
                sx={{
                  border: "10px solid #646669",
                  borderRadius: "30px",
                  background: "#E2B714",
                  padding: "7px 40px 7px 40px",
                  fontWeight: "bolder",
                  fontSize: 35,
                  cursor: "pointer",
                }}
              >
                Start
              </Box>
            </IconButton>
          </div>
        </div>
      )}
    </GameScreenContext.Consumer>
  );
};

export default WebGazerCalibration;
