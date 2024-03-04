import { Box } from "@mui/material";
import React from "react";

const WpmSign: React.FC<{
  wpm: number;
  size?: number;
}> = ({ wpm, size }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 60,
        left: "50%", // Set to 50% of the container's width
        transform: "translateX(-50%)", // Move the element back by half of its own width
        backgroundColor: "#D1D0C5",
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: size || "16px",
        fontWeight: "bold",
        zIndex: 10,
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      WPM: {wpm}
    </Box>
  );
};

export default WpmSign;
