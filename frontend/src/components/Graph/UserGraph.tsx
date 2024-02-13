import { Box, MenuItem, SelectChangeEvent } from "@mui/material";
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
import { StyledFormControl, StyledSelect } from "../Button/DropDownMenu";

const DropDownMode: React.FC<{
  selectValue: string;
  selectOnChange: (event: SelectChangeEvent<string>) => void;
  size: number;
}> = ({ selectValue, selectOnChange, size }) => {
  console.log(size);
  return (
    <StyledFormControl>
      <StyledSelect value={selectValue} onChange={selectOnChange}>
        <MenuItem value="standard">standard</MenuItem>
        <MenuItem value="adaptive">adaptive</MenuItem>
        <MenuItem value="summarised">summarised</MenuItem>
      </StyledSelect>
    </StyledFormControl>
  );
};

const UserGraph = () => {
  const [mode, setMode] = useState<string>("standard");

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

  const handleSelectMode = (event: SelectChangeEvent<string>) => {
    setMode(event.target.value as string);
  };

  return (
    <Box
      sx={{
        flex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <DropDownMode
        selectValue={mode}
        selectOnChange={handleSelectMode}
        size={fontSize}
      ></DropDownMode>
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
