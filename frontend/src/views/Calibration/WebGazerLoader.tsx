import React from "react";
import Calibration from "./Calibration";
import { WebGazerContext } from "./WebGazerContext";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Script: any = require("react-load-script");

declare const webgazer: any;

interface WebGazerState {
  context: { x: number; y: number };
}

class WebGazerLoader extends React.Component<any, WebGazerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      context: { x: -1, y: -1 },
    };
  }

  async handleScriptLoad() {
    await webgazer.clearData();

    await webgazer
      .setRegression("ridge")
      .setGazeListener((data: any, _clock: any) => {
        if (data == null) {
          return;
        }
        this.setState({ context: webgazer.util.bound(data) });
      })
      .saveDataAcrossSessions(true)
      .begin();

    await webgazer
      .showPredictionPoints(
        true,
      ) /* shows a square every 100 milliseconds where current prediction is */
      .showVideoPreview(true)
      // turn the above off for production
      .applyKalmanFilter(true); /* Kalman Filter defaults to on */
  }

  async turnOffCam() {
    console.log("turnOffCam");
    await webgazer.showVideoPreview(false);
  }

  handleScriptError() {
    console.log("error");
  }

  async webgazerRestart() {
    console.log("webgazerRestart");
    await webgazer.clearData();
  }

  async handleEnd() {
    console.log("handleEnd");
    await webgazer.end();
  }

  render() {
    return (
      <WebGazerContext.Provider value={this.state.context}>
        <Script
          url="https://webgazer.cs.brown.edu/webgazer.js"
          onLoad={this.handleScriptLoad.bind(this)}
          onError={this.handleScriptError.bind(this)}
        />
        <Calibration
          restartWebgazerMethod={this.webgazerRestart.bind(this)}
          endWedgazerMethod={this.handleEnd.bind(this)}
          turnOffCam={this.turnOffCam.bind(this)}
        />
      </WebGazerContext.Provider>
    );
  }
}
WebGazerLoader.contextType = WebGazerContext;

export default WebGazerLoader;
