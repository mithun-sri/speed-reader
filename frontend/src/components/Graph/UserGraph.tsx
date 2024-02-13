import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
        flex: 3,
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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dummyData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="wpm" stroke="#E2B714" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const dummyData = [
  {
    date: "12 Jan 2024 12:01",
    wpm: 240,
  },
  {
    date: "12 Jan 2024 12:01",
    wpm: 139,
  },
  {
    date: "12 Jan 2024 12:01",
    wpm: 280,
  },
  {
    date: "12 Jan 2024 12:01",
    wpm: 390,
  },
  {
    date: "12 Jan 2024 12:01",
    wpm: 480,
  },
  {
    date: "12 Jan 2024 12:01",
    wpm: 380,
  },
  {
    date: "12 Jan 2024 12:01",
    wpm: 430,
  },
];

export default UserGraph;
