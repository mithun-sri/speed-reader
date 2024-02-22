import { Box } from "@mui/material";
import { useState } from "react";
import { TextWithQuestions } from "../../api";
import GptPrompt from "../../components/Gpt/GptPrompt";
import GptSuggestionForm from "../../components/Gpt/GptSuggestionForm";
import Header from "../../components/Header/Header";
import { GptProvider, useGptContext } from "../../context/GptContext";

const GptForm = () => {
  const { updateContextValue } = useGptContext();
  const [showResponse, setShowResponse] = useState<boolean>(false);

  const handleGenerateResponse = (gpt_response: TextWithQuestions) => {
    console.log("GptView: handleGenerateResponse");
    updateContextValue(gpt_response);
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
          {showResponse ? <GptSuggestionForm /> : <></>}
        </Box>
      </Box>
    </>
  );
};

const GptView = () => {
  return (
    <GptProvider>
      <GptForm />
    </GptProvider>
  );
};

export default GptView;
