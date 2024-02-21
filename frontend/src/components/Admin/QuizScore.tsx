import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";

const QuizScore: React.FC<{
  score: number;
}> = ({ score }) => {
  const [circleWidth, setCircleWidth] = useState(window.innerWidth / 7);
  const [_progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(score);
  }, [score]);

  useEffect(() => {
    const handleResize = () => {
      setCircleWidth(window.innerWidth / 7);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginBottom: "2vw" }}>
        <Typography
          sx={{
            fontSize: circleWidth / 5,
            fontWeight: "bolder",
            fontFamily: "JetBrains Mono, monospace",
            color: "#FFFFFF",
          }}
        >
          score.
        </Typography>
      </Box>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          sx={{ color: "#E2B714" }}
          size={circleWidth / 1.2}
          variant="determinate"
          value={score}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="#E2B714"
            fontWeight="bolder"
            fontSize={circleWidth / 4}
          >{`${Math.round(score)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default QuizScore;
