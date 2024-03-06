import { Box, CircularProgress } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import GptPrompt from "../../components/Gpt/GptPrompt";
import GptSuggestionForm from "../../components/Gpt/GptSuggestionForm";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";

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
            <GptSuggestionForm
              difficulty={diff}
              isFiction={isFiction}
              setShowResponse={setShowResponse}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
};

const GptLoadingFallback = () => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 35));
  };
  const [fontSize, setFontSize] = useState(calculateFontSize());
  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        color: "#E2B714",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress
        color="inherit"
        size="100px"
        sx={{ marginBottom: "50px" }}
      />
      <JetBrainsMonoText
        text="Generating text. This may take a while..."
        size={fontSize * 0.6}
        color="#FFFFFF"
      />
    </Box>
  );
};

const GptView = () => {
  return (
    <Suspense fallback={<GptLoadingFallback />}>
      <GptForm />
    </Suspense>
  );
};

export default GptView;
