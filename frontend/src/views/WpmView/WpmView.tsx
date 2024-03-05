import { Box } from "@mui/material";
import BackButton from "../../components/Button/BackButton";
import StartButton from "../../components/Button/StartButton";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";
import { useGameScreenContext } from "../GameScreen/GameScreen";
import { useWebGazerContext } from "../../context/WebGazerContext";

const WpmView = () => {
  const { decrementCurrentStage } = useGameScreenContext();
  const {textId} = useWebGazerContext();
  return (
    <>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px" }}>
        {
          textId === null ?
            <BackButton label="view" handleClick={decrementCurrentStage} />
            : null
        }
      </Box>
      <Box
        sx={{
          textAlign: "center",
          minHeight: "20vh",
        }}
      >
        <SpeedSlider />
        <StartButton />
      </Box>
    </>
  );
};

export default WpmView;
