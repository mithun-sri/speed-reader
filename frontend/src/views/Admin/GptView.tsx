import { Box } from "@mui/material";
import GptPrompt from "../../components/Gpt/GptPrompt";
import Header from "../../components/Header/Header";

const GptView = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "450px",
        }}
      >
        <GptPrompt />
      </Box>
    </>
  );
};

export default GptView;
