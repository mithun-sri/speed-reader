import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface AnalyticsModeProps {
  selectedOption: string;
  handleOptionClick: (option: string) => void;
}

const AnalyticsMode: React.FC<AnalyticsModeProps> = ({
  selectedOption,
  handleOptionClick,
}) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 10;
    const maxFontSize = 15;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 40));
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
        backgroundColor: "#646669",
        borderRadius: 40,
        fontFamily: "JetBrains Mono, monospace",
        alignItems: "center",
        fontSize: fontSize,
        maxWidth: "500px",
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: "3px 15px",
          margin: 0.5,
          color: selectedOption === "standard" ? "white" : "#D1D0C5",
          fontWeight: selectedOption === "standard" ? "bolder" : "regular",
          backgroundColor:
            selectedOption === "standard" ? "#E2B714" : "transparent",
          borderRadius: 40,
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={() => handleOptionClick("standard")}
      >
        standard
      </Box>
      <Box
        sx={{
          flex: 3,
          padding: "3px 15px",
          margin: 0.5,
          color: selectedOption === "summarized" ? "white" : "#D1D0C5",
          fontWeight: selectedOption === "summarized" ? "bolder" : "regular",
          backgroundColor:
            selectedOption === "summarized" ? "#E2B714" : "transparent",
          borderRadius: 40,
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={() => handleOptionClick("summarized")}
      >
        summarized adpative
      </Box>
      <Box
        sx={{
          flex: 1,
          padding: "3px 15px",
          margin: 0.5,
          color: selectedOption === "adaptive" ? "white" : "#D1D0C5",
          fontWeight: selectedOption === "adaptive" ? "bolder" : "regular",
          backgroundColor:
            selectedOption === "adaptive" ? "#E2B714" : "transparent",
          borderRadius: 40,
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={() => handleOptionClick("adaptive")}
      >
        adaptive
      </Box>
    </Box>
  );
};

export default AnalyticsMode;
