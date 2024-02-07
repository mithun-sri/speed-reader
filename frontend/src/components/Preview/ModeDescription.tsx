import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

interface ModeDescriptionProps {
  mode: string;
  description: string;
}

const ModeDescriptionComponent: React.FC<ModeDescriptionProps> = ({
  mode,
  description,
}) => {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: fontSize * 7,
        justifyContent: "center",
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          margin: "30px",
          fontSize: fontSize / 1.89,
          alignContent: "center",
          textAlign: "center",
        }}
      >
        {mode}
      </Box>
      <Box
        sx={{
          alignContent: "center",
          textAlign: "center",
          fontSize: fontSize / 3.4,
        }}
      >
        {description}
      </Box>
    </Box>
  );
};

export default ModeDescriptionComponent;
