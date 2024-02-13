import { faFly } from "@fortawesome/free-brands-svg-icons";
import { faPlaneDeparture, faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React from "react";

const SliderLevelText: React.FC<{
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
        fontSize: fontSize / 1.4,
        fontWeight: "bolder",
        fontFamily: "JetBrains Mono, monospace",
        height: "90px",
      }}
    >
      <Box sx={{ width: "20%", marginTop: "12px" }}>
        <FontAwesomeIcon fontSize={fontSize * 1.3} icon={faFly} />
      </Box>
      <Box sx={{ width: "50%", marginTop: "12px" }}>
        <FontAwesomeIcon fontSize={fontSize * 1.3} icon={faPlaneDeparture} />
      </Box>
      <Box sx={{ width: "20%", marginTop: "12px" }}>
        <FontAwesomeIcon fontSize={fontSize * 1.3} icon={faRocket} />
      </Box>
    </Box>
  );
};

export default SliderLevelText;
