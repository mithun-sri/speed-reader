import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";

const BackButton: React.FC<{
  label?: string;
}> = ({ label }) => {
  const { decrementCurrentStage } = useGameScreenContext();
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
    const minSize = 40;
    const maxSize = 180;
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 6),
    );
    return calculatedSize;
  }

  const buttonText: string = label || "back";

  return (
    <IconButton
      onClick={() => {
        decrementCurrentStage();
      }}
      sx={{
        fontFamily: "JetBrains Mono, monospace",
        color: "#FFFFFF",
        fontWeight: "bolder",
        fontSize: fontSize / 6.8,
      }}
    >
      {`<_${buttonText}`}
    </IconButton>
  );
};

export default BackButton;
