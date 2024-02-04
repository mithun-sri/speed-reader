import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";

const Score: React.FC<{
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
    <Box>
      <Box sx={{ 
        fontSize: circleWidth / 4.2, 
        fontWeight: "bolder", 
        fontFamily: "JetBrains Mono, monospace",
        margin: "30px",
        paddingRight: circleWidth / 14
      }}>
        score.
      </Box>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress sx = {{color: "#E2B714" }} size={circleWidth} variant="determinate" value={score} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="#E2B714"
            fontWeight="bolder"
            fontSize={circleWidth / 3.2}
          >{`${Math.round(score)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Score;
