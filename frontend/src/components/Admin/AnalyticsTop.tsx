import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useEffect, useState } from "react";

interface AdminAnalyticsTopProps {
  selectedValue: string;
  onSelectedValueChange: (newValue: string) => void;
}

const AdminAnalyticsTop: React.FC<AdminAnalyticsTopProps> = ({
  selectedValue,
  onSelectedValueChange,
}) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 25;
    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 30));
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

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    onSelectedValueChange(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "500px",
        fontSize: fontSize,
        color: "#fff",
        fontWeight: "bolder",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      User Analytics by
      <Select
        value={selectedValue}
        onChange={handleChange}
        sx={{
          minWidth: 120,
          marginLeft: 2,
          borderRadius: 4,
          backgroundColor: "#323437",
          padding: "0px 14px",
          fontSize: fontSize / 1.3,
          color: "#fff",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        <MenuItem value="text">text</MenuItem>
        <MenuItem value="mode">mode</MenuItem>
      </Select>
    </Box>
  );
};

export default AdminAnalyticsTop;
