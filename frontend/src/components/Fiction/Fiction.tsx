import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface FictionBoxProps {
    is_fiction?: boolean;
}

const FictionBox: React.FC<FictionBoxProps> = ({ is_fiction }) => {

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "30%",
        padding: "0.25vw 0.45vw",
        borderRadius: "0.8vw",
        backgroundColor: "#26272a",
        fontWeight: "bolder",
        fontSize: "0.8vw",
        fontFamily: "JetBrains Mono, monospace",
        color: "#E2B714",
        marginLeft: "10px",
      }}
    >
        {is_fiction ? "FICTION" : "NON-FICTION"}
    </Box>
  );
};

export default FictionBox;
