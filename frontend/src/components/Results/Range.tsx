import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface RangeProps {
  low: number;
  high: number;
}

const Range: React.FC<RangeProps> = ({ low, high }) => {
  const [fontSize, setFontSize] = useState(window.innerWidth / 30);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth / 30);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
        color: "#fff",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          fontSize: fontSize,
        }}
      >
        range.
      </Box>
      <Box
        sx={{
          fontSize: fontSize / 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              marginRight: "6vw",
            }}
          >
            <Box>max</Box>
            <Box>min</Box>
          </Box>
          <Box
            sx={{
              margin: 2,
            }}
          >
            <Box>{high}</Box>
            <Box>{low}</Box>
          </Box>
          <Box
            sx={{
              margin: 2,
              fontSize: fontSize / 2.5,
            }}
          >
            <Box>wpm.</Box>
            <Box>wpm.</Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
        }}
      >
        ddwwdwdddddddddddddddddddddddddddddddddddddddddd
      </Box>
    </Box>
  );
};

export default Range;
