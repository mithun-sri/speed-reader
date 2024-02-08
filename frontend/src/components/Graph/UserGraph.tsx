import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useState } from "react";

const UserGraph = () => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 35));
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

  return (
    <Box
      sx={{
        flex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          color: "#FFFFFF",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          fontSize: fontSize,
        }}
      >
        STANDARD MODE
      </Box>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            id: "line1",
            curve: "linear",
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={725}
        height={400}
        sx={{
          flex: 2,
          // data line
          "& .MuiLineElement-root": {
            stroke: "#E2B714",
            strokeDasharray: "10 5",
            strokeWidth: 2,
          },
          // data plots
          "& .MuiMarkElement-root": {
            stroke: "#E2B714",
            strokeWidth: 3,
          },
          // x and y axis
          "& .MuiChartsAxis-line, .MuiChartsAxis-tick": {
            stroke: "#646669",
            strokeWidth: 3,
          },
          // numbers of the x and y axis
          "& .MuiChartsAxis-left, .MuiChartsAxis-directionX": {
            stroke: "#D1D0C5",
          },
        }}
      />
    </Box>
  );
};

// https://mui.com/x/react-charts/lines/#css

export default UserGraph;
