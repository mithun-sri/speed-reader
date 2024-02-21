import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface QuizAnalyticsTopProps {
  question: string;
  link?: string;
}

const QuizAnalyticsTop: React.FC<QuizAnalyticsTopProps> = ({ question }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 10;
    const maxFontSize = 25;
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
        marginTop: "1vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "900px",
        fontSize: fontSize,
        color: "#fff",
        fontWeight: "bolder",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      Statistics for
      <Box
        sx={{
          fontSize: fontSize * 1.4,
          marginTop: "1vw",
        }}
      >
        {question}
      </Box>
    </Box>
  );
};

export default QuizAnalyticsTop;
