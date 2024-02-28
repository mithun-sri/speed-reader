import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface DifficultyBoxProps {
  difficulty: string;
}

const DifficultyBox: React.FC<DifficultyBoxProps> = ({ difficulty }) => {
  const [color, setColor] = useState<string>("black");

  useEffect(() => {
    const getDifficultyColor = () => {
      switch (difficulty.toUpperCase()) {
        case "HARD":
          return "#FC1D1D";
        case "MED":
          return "#E2B714";
        case "EASY":
          return "#379F3B";
        default:
          return "#000"; // default color if difficulty is not recognized
      }
    };

    setColor(getDifficultyColor());
  }, [difficulty]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        // marginLeft: "0.65vw",
        width: "30%",
        padding: "0.25vw 0.45vw",
        borderRadius: "0.8vw",
        backgroundColor: color,
        fontWeight: "bolder",
        fontSize: "1vw",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      {difficulty.toUpperCase()}
    </Box>
  );
};

export default DifficultyBox;
