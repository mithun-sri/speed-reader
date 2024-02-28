import Box from "@mui/material/Box";
import React from "react";
import JetBrainsMonoText from "../Text/TextComponent";

const BlurBox: React.FC<{
  text: string;
  size: number;
  color: string;
}> = ({ text, size, color }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "15%",
        bottom: "15%",
        left: "0",
        width: "100%",
        height: "65%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(15px)",
        // backgroundColor: "white",
      }}
    >
      <JetBrainsMonoText text={text} size={size} color={color} />
    </Box>
  );
};

export default BlurBox;
