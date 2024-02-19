import { Box, IconButton } from "@mui/material";
import { MouseEventHandler, useEffect, useState } from "react";

const GptButton: React.FC<{
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  color: string;
  label: string;
  submit?: boolean;
}> = ({ onButtonClick = () => {}, color, label, submit }) => {
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
      Math.max(minSize, windowWidth / 70),
    );
    return calculatedSize;
  }

  return (
    <IconButton
      type={submit ? "submit" : undefined}
      onClick={onButtonClick}
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        color: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          border: "7px solid #646669",
          borderRadius: "20px",
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
