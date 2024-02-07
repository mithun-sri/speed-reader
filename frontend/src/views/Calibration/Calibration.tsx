import { Box } from "@mui/material";
import React from "react";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { GameScreenContext } from "../GameScreen/GameScreen";
import "./Calibration.css";
import { WebGazerContext } from "./WebGazerContext";

class Calibration extends React.Component<any, any> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private pointCalibrate: number;

  constructor(props: any) {
    super(props);

    this.canvasRef = React.createRef();
    this.pointCalibrate = 0;

    // Initialize state to track the number of clicks for each calibration point
    this.state = {
      hasLoaded: false,
      clickCounts: {
        Pt1: 0,
        Pt2: 0,
        Pt3: 0,
        Pt4: 0,
        Pt5: 0,
        Pt6: 0,
        Pt7: 0,
        Pt8: 0,
        Pt9: 0,
      },
    };

    this.handleRestart = this.handleRestart.bind(this);
  }

  componentDidMount() {
    if (!this.state.hasLoaded) {
      window.addEventListener("load", () => {
        // Call this.setup() after the window has loaded
        this.canvasSetup();
        // Call this.docLoad() after the canvas has been set up
        this.docLoad();
        this.setState(() => ({ hasLoaded: true }));
      });
    }
  }

  componentWillUnmount() {
    this.props.endWedgazerMethod();
    window.removeEventListener("load", this.docLoad);
  }

  docLoad() {
    // Perform actions after the component has fully loaded
    this.clearCanvas();
    document
      .getElementById("calibration_done")
      ?.style.setProperty("display", "none");
    document.getElementById("Pt5")?.style.setProperty("display", "none");
    document
      .getElementById("calibration_in_progress")
      ?.style.setProperty("display", "block");
  }

  canvasSetup() {
    //Set up the main canvas. The main canvas is used to calibrate the webgazer.
    const canvas = document.getElementById(
      "plotting_canvas",
    ) as HTMLCanvasElement;
    if (canvas === null) {
      return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
  }

  clearCanvas() {
    const canvas = this.canvasRef.current;
    if (canvas) {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  async calcPointClick(node: any) {
    const id = node.id;

    // Increment the click count in the state for the clicked button
    this.setState(
      (prevState: any) => ({
        clickCounts: {
          ...prevState.clickCounts,
          [id]: prevState.clickCounts[id] + 1,
        },
      }),
      async () => {
        if (this.state.clickCounts[id] >= 5) {
          this.pointCalibrate++;
        }

        //Show the middle calibration point after all other points have been clicked.
        if (this.pointCalibrate === 8) {
          const cal_in_progress = document.getElementById(
            "calibration_in_progress",
          ) as HTMLElement;
          cal_in_progress.style.setProperty("display", "none");
          document.getElementById("Pt5")?.style.removeProperty("display");
          await this.props.turnOffCam();
        }

        if (this.pointCalibrate >= 9) {
          // last point is calibrated
          // grab every element in Calibration class and hide them except the middle point.
          document
            .querySelectorAll(".CalibrationButton")
            .forEach((i: Element) => {
              if (i instanceof HTMLElement) {
                i.style.setProperty("display", "none");
              }
            });
          document.getElementById("Pt5")?.style.removeProperty("display");

          const cal_done = document.getElementById(
            "calibration_done",
          ) as HTMLElement;
          cal_done.style.setProperty("display", "block");

          // clears the canvas
          const canvas = this.canvasRef.current;
          if (canvas) {
            canvas
              .getContext("2d")
              ?.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      },
    );
  }

  showCalibrationPoint() {
    document.querySelectorAll(".CalibrationButton").forEach((i: Element) => {
      if (i instanceof HTMLElement) {
        i.style.removeProperty("display");
      }
    });
    // initially hides the middle button
    document.getElementById("Pt5")?.style.setProperty("display", "none");
  }

  async handleRestart() {
    await this.props.restartWebgazerMethod();

    document.querySelectorAll(".CalibrationButton").forEach((i: Element) => {
      if (i instanceof HTMLElement) {
        i.style.setProperty("background-color", "#D1D0C5");
        i.style.setProperty("opacity", "0.2");
        i.removeAttribute("disabled");
      }
    });

    this.setState({
      clickCounts: {
        Pt1: 0,
        Pt2: 0,
        Pt3: 0,
        Pt4: 0,
        Pt5: 0,
        Pt6: 0,
        Pt7: 0,
        Pt8: 0,
        Pt9: 0,
      },
    });

    this.pointCalibrate = 0;
    this.clearCanvas();
    this.showCalibrationPoint();
    const cal_done = document.getElementById("calibration_done") as HTMLElement;
    cal_done.style.setProperty("display", "none");
    const cal_in_progress = document.getElementById(
      "calibration_in_progress",
    ) as HTMLElement;
    cal_in_progress.style.setProperty("display", "block");
  }

  render() {
    return (
      <GameScreenContext.Consumer>
        {(context) => (
          <div id="container">
            <canvas
              ref={this.canvasRef}
              id="plotting_canvas"
              width={500}
              height={500}
              style={{ cursor: "crosshair" }}
            />

            <div className="calibrationDiv">
              {Object.keys(this.state.clickCounts).map((pointId) => (
                <button
                  key={pointId}
                  className="CalibrationButton"
                  id={pointId}
                  onClick={() =>
                    this.calcPointClick(document.getElementById(pointId))
                  }
                  disabled={this.state.clickCounts[pointId] >= 5}
                  style={{
                    opacity: (
                      0.2 *
                      (this.state.clickCounts[pointId] + 1)
                    ).toString(),
                    backgroundColor:
                      this.state.clickCounts[pointId] >= 5
                        ? "#E2B714"
                        : "#D1D0C5",
                  }}
                />
              ))}
            </div>

            <div
              id="calibration_in_progress"
              className="calibration-in-progress"
            >
              <div className="in_progress_text">
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

            <div id="calibration_done" className="calibration-done">
              <JetBrainsMonoText
                text={"Calibration done!"}
                size={35}
                color="#D1D0C5"
              />
              <Box
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: "bold",
                  fontSize: 25,
                  color: "#E2B714",
                }}
                onClick={() => {
                  context.incrementCurrentStage();
                }}
                style={{ zIndex: 10 }}
              >
                Start
              </Box>
            </div>

            {/* Temporary button for ease of testing */}
            <button
              type="button"
              id="restart_calibration"
              className="top-button"
              onClick={this.handleRestart}
            >
              Recalibrate
            </button>
          </div>
        )}
      </GameScreenContext.Consumer>
    );
  }
}
Calibration.contextType = WebGazerContext;

export default Calibration;
