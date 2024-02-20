import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Score from "../Results/Score";
import AvgWpm from "../Results/AvgWpm";
import Range from "../Results/Range";

interface AdminStatisticsProps {
  score: number;
  avgWpm: number;
  low: number;
  high: number;
}

const AdminStatistics: React.FC<AdminStatisticsProps> = ({
  score,
  avgWpm,
  low,
  high,
}) => {
  return (
    <Box
      sx={{
        marginTop: "0.7vw",
        display: "flex",
      }}
    >
      <Box sx={{ marginRight: "2vw" }}>
        <Score score={score} />
        <Box sx={{ margin: "1vw" }}></Box>
        <AvgWpm avg={avgWpm} />
      </Box>
      <Range low={low} high={high} />
    </Box>
  );
};

export default AdminStatistics;
