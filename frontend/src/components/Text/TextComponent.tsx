import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const JetBrainsMonoText: React.FC<{
  text: string;
  size: number;
  color: string;
}> = ({ text, size, color }) => {
  return (
    <Box>
      <Typography
        variant="body1"
        color={color}
        sx={{
          fontSize: size,
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default JetBrainsMonoText;
