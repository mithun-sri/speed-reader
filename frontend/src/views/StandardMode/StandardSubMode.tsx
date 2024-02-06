import Box from "@mui/material/Box";
import Header from "../../components/Header/Header";
import WordByWordPreview from "../../components/Preview/WordByWord";
import { useEffect, useState } from "react";
import HighlightWordsPreview from "../../components/Preview/HighlightWords";
import PeripheralPreview from "../../components/Preview/Peripheral";
import IconButton from "@mui/material/IconButton";

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
        <IconButton>
          <WordByWordPreview text={previewText} />
        </IconButton>
        <Box sx={{ width: "5vw" }} />
        <IconButton>
          <HighlightWordsPreview text={previewText} />
        </IconButton>
        <Box sx={{ width: "5vw" }} />
        <IconButton>
          <PeripheralPreview text={previewText} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default StandardSubModeView;
