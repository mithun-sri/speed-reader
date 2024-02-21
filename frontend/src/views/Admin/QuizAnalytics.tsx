import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import Header from "../../components/Header/Header";
import { Box } from "@mui/material";
import QuizAnalyticsTop from "../../components/Admin/QuizAnalyticsTop";
import QuizScore from "../../components/Admin/QuizScore";

const QuizAnalytics: React.FC = () => {
  const formatTick = (tick: number) => {
    return `${tick}%`;
  };

  // Make request to client
  const data = [
    { question: "he was a chic", proportion: 72 },
    { question: "he was hungry", proportion: 10 },
    { question: "he was not hun", proportion: 18 },
  ];
  const correctAnswer = 0;
  const avgScore = 72;

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <QuizAnalyticsTop
          question="Why did the chicken cross the road?"
          link="google.com"
        />
        <Box
          sx={{
            backgroundColor: "#323437",
            borderRadius: "50px",
            margin: "20px 50px",
            padding: "4vw 8vw 3.1vw",
            width: "70vw",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <BarChart width={900} height={400} data={data}>
            <CartesianGrid stroke="transparent" />
            <XAxis
              dataKey="question"
              tick={{ fill: "white", fontSize: 18, fontWeight: "bold" }}
              tickLine={false}
              axisLine={{ stroke: "white" }}
            />
            <YAxis
              tick={{ fill: "white" }}
              tickLine={false}
              axisLine={{ stroke: "white" }}
              tickFormatter={formatTick}
            />
            <Tooltip />
            <Bar dataKey="proportion" barSize={150}>
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === correctAnswer ? "#379F3B" : "#979797"}
                />
              ))}
            </Bar>
          </BarChart>
          <Box sx={{ width: "2vw" }} />
          <QuizScore score={avgScore} />
        </Box>
      </Box>
    </>
  );
};

export default QuizAnalytics;
