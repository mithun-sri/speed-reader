import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const JetBrainsMonoText: React.FC<{
  text: string;
  size: number;
  color: string;
}> = ({ text, size, color }) => {
  return (
    <Box
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: size || "30vhca",
        color: color || "#000",
      }}
    >
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};

export default JetBrainsMonoText;
