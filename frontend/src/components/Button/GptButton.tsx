import { Box, IconButton } from "@mui/material";
import { MouseEventHandler, useEffect, useState } from "react";

// onButtonClick
// color
const GptButton: React.FC<{
  onButtonClick: MouseEventHandler<HTMLButtonElement>;
  color: string;
  label: string;
}> = ({ onButtonClick, color, label }) => {
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

  function calculateFontSize() {
    const windowWidth = window.innerWidth;
    const minSize = 20;
    const maxSize = 36;
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 50),
    );
    return calculatedSize;
  }

  return (
    <IconButton
      onClick={() => {
        onButtonClick;
      }}
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        color: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          border: "7px solid #646669",
          borderRadius: "30px",
          background: color,
          padding: "7px 40px 7px 40px",
          fontWeight: "bolder",
          fontSize: fontSize,
        }}
      >
        {label}
      </Box>
    </IconButton>
  );
};

export default GptButton;
