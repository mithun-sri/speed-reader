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
import { UserStatisticsAverageWpmPerDay } from "../../api";

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
      </StyledSelect>
    </StyledFormControl>
  );
};

interface UserGraphProps {
  data: UserStatisticsAverageWpmPerDay[];
  mode: string;
  setMode: (mode: string) => void;
}

const UserGraph: React.FC<UserGraphProps> = ({ data, mode, setMode }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 35));
  };
  const [fontSize, setFontSize] = useState(calculateFontSize());

  const formattedData = data.map((entry) => {
    return {
      date: new Date(entry.date).toLocaleDateString(),
      wpm: entry.wpm,
    };
  });

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
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* Change format of date to shorter */}
          <XAxis dataKey="date" />

          <YAxis
            domain={[
              0,
              Math.max(
                580,
                Math.max(...formattedData.map((row) => row.wpm)) + 20,
              ),
            ]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#E2B714"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UserGraph;
