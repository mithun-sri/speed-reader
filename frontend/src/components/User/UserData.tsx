import { Box } from "@mui/material";
import React from "react";

const UserData: React.FC<{
  title: string;
  value: string;
  size: number;
}> = ({ title, value, size }) => {
  return (
    <Box sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          fontSize: size,
          color: "#FFFFFF",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          maxWidth: "200px",
        }}
      >
        {title}.
      </Box>
      <Box
        sx={{
          fontSize: size * 1.9,
          color: "#E2B714",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          marginRight: "25px",
          textAlign: "right",
        }}
      >
        {value}
      </Box>
    </Box>
  );
};

export default UserData;
