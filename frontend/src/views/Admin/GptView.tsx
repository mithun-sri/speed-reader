import { Box } from "@mui/material";
import { useState } from "react";
import GptPrompt from "../../components/Gpt/GptPrompt";
import GptSuggestionForm from "../../components/Gpt/GptSuggestionForm";
import Header from "../../components/Header/Header";

const GptView = () => {
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  const [showResponse, setShowResponse] = useState<boolean>(false);

  const handleGenerateResponse = (response: string) => {
    console.log("GptView: handleGenerateResponse");
    setGeneratedResponse(response);
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
            <GptSuggestionForm response={generatedResponse} />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
};

export default GptView;
