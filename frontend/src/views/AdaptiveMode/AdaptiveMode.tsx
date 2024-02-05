import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import { HighlightedTextDisplay } from "../StandardMode/StandardMode";

const TEXT =
  "adaptive mode text adaptive mode text adaptive mode text adaptive mode text adaptive mode text adaptive mode text adaptive mode text adaptive mode text adaptive mode text ";

const AdaptiveModeView = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-20vh",
          padding: "25px",
        }}
      >
        <HighlightedTextDisplay text={TEXT} wpm={200} />
      </Box>
    </Box>
  );
};

export default AdaptiveModeView;
