import { Box } from "@mui/material";
import React from "react";

const SliderRateText: React.FC<{
  fontSize: number;
}> = ({ fontSize }) => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        width: "78%",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: fontSize / 2.7,
        fontWeight: "bolder",
        fontFamily: "JetBrains Mono, monospace",
        height: "70px",
        paddingBottom: "20px",
      }}
    >
      <Box sx={{ width: "20%" }}>100-150 WPM</Box>
      <Box sx={{ width: "50%" }}>200-300 WPM</Box>
      <Box sx={{ width: "20%", marginTop: "12px" }}>600+ WPM</Box>
    </Box>
  );
};

export default SliderRateText;
