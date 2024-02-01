import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";

const GameProgressBar: React.FC<{
  gameProgress: number;
}> = ({ gameProgress }) => {
  const [_progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(gameProgress);
  }, [gameProgress]);

  return (
    <Box
      sx={{
        alignContent: "center",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={gameProgress}
        sx={{
          backgroundColor: "#646669",
          ".MuiLinearProgress-bar": { backgroundColor: "#B49A3A" },
        }}
      />
    </Box>
  );
};

export default GameProgressBar;
