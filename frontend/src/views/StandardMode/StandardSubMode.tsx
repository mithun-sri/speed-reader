import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import HighlightWordsPreview from "../../components/Preview/HighlightWords";
import PeripheralPreview from "../../components/Preview/Peripheral";
import WordByWordPreview from "../../components/Preview/WordByWord";

const StandardSubModeView = () => {
  const previewText =
    "Is this a dagger which I see before me, The handle toward my hand? Come, let me clutch thee. I have thee not, and yet I see thee still.";
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 16;
    const maxFontSize = 48;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
  };

  const [fontSize, setFontSize] = useState(calculateFontSize());

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box>
      <Header />
      <Box
        sx={{
          marginTop: fontSize / 6,
          color: "#D1D0C5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: fontSize / 1.4,
          fontWeight: "bold",
          marginBottom: fontSize / 8,
        }}
      >
        choose your mode.
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <WordByWordPreview text={previewText} />
        <Box sx={{ width: "5vw" }} />
        <HighlightWordsPreview text={previewText} />
        <Box sx={{ width: "5vw" }} />
        <PeripheralPreview text={previewText} />
      </Box>
    </Box>
  );
};

export default StandardSubModeView;
