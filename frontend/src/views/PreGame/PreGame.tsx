import { Box } from "@mui/material";
import BackButton from "../../components/Button/BackButton";
import StartButton from "../../components/Button/StartButton";
import Header from "../../components/Header/Header";
import SpeedSlider from "../../components/Slider/Slider";
import "./PreGame.css";

const PreGameView = () => {
  return (
    <>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px" }}>
        <BackButton label="view" />
      </Box>
      <Box
        sx={{
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        <SpeedSlider />
        <StartButton />
      </Box>
    </>
  );
};

export default PreGameView;
