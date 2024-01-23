import React from 'react';
import { Box } from '@mui/material';

const SliderRateText: React.FC<{
    fontSize: number;
}> = ({ fontSize }) => {
  return (
    <Box sx={{
      margin: "0 auto",
      width: "78%",
      textAlign: "center",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff", 
      fontSize: fontSize/2.6,
      fontWeight: "bolder",
      fontFamily: "JetBrains Mono, monospace",
      height: "90px",
      paddingBottom: "20px"
    }}>
      <Box sx={{ width: "20%" }}>100-150 WPM</Box>
      <Box sx={{ width: "50%" }}>200-300 WPM</Box>
      <Box sx={{ width: "20%", marginTop: "12px" }}>600+ WPM</Box>
    </Box>
  );
}

export default SliderRateText;