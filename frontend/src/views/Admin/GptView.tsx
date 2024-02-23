import { Box } from "@mui/material";
import { useState } from "react";
import GptPrompt from "../../components/Gpt/GptPrompt";
import GptSuggestionForm from "../../components/Gpt/GptSuggestionForm";
import Header from "../../components/Header/Header";

const GptForm = () => {
  const [showResponse, setShowResponse] = useState<boolean>(false);
  const [diff, setDiff] = useState<string>("easy");
  const [isFiction, setIsFiction] = useState<boolean>(false);

  const handleGenerateResponse = (difficulty: string, fiction: boolean) => {
    console.log("GptView: handleGenerateResponse");
    setDiff(difficulty);
    setIsFiction(fiction);
    setShowResponse(true);
  };

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
  };

  const innerContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    minWidth: "450px",
    maxWidth: "1050px",
  };

  return (
    <>
      <Header />
      <Box sx={containerStyles}>
        <Box sx={innerContainerStyles}>
          <GptPrompt onGenerateResponse={handleGenerateResponse} />
          {showResponse ? (
            <GptSuggestionForm difficulty={diff} isFiction={isFiction} />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
};

const GptView = () => {
  return (
    // <GptProvider>
    <GptForm />
    // </GptProvider>
  );
};

export default GptView;
