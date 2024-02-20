import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface AvgWpmProps {
  avg: number;
}

const AvgWpm: React.FC<AvgWpmProps> = ({ avg }) => {
  const [fontSize, setFontSize] = useState(window.innerWidth / 7);

  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth / 7);
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginRight: "16vw" }}>
        <Typography
          sx={{
            fontSize: fontSize / 9,
            fontWeight: "bolder",
            fontFamily: "JetBrains Mono, monospace",
            color: "#FFFFFF",
          }}
        >
          average <br />
          wpm.
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: fontSize / 3,
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          color: "#E2B714",
        }}
      >
        {avg}
      </Typography>
    </Box>
  );
};

export default AvgWpm;
