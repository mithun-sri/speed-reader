import { Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import PlayAgain from "./PlayAgain";
import ChangeGameMode from "./ChangeGameMode";

const ResultsBottom = () => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 5;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 20));
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
    <Box
      sx={{
        display: "flex",
        color: "#E2B714",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PlayAgain fontSize={fontSize} />
      <Divider
        orientation="vertical"
        sx={{
          borderColor: "#E2B714",
          height: fontSize * 2.6,
          mx: "20px",
          borderWidth: "2.2px",
          borderRadius: "2px",
        }}
      />
      <ChangeGameMode fontSize={fontSize} />
    </Box>
  );
};

export default ResultsBottom;
