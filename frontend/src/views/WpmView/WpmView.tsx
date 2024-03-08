import { Box } from "@mui/material";
import BackButton from "../../components/Button/BackButton";
import StartButton from "../../components/Button/StartButton";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const WpmView = () => {
  const { decrementCurrentStage } = useGameScreenContext();
  const { textId_ } = useWebGazerContext();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px" }}>
        {textId_ === null ? (
          <BackButton label="view" handleClick={decrementCurrentStage} />
        ) : null}
      </Box>
      <Box
        sx={{
          textAlign: "center",
          minHeight: "20vh",
          flex: 1,
        }}
      >
        <SpeedSlider />
        <StartButton />
      </Box>
      <Footer />
    </Box>
  );
};

export default WpmView;
