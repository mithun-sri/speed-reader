import { Box, IconButton } from "@mui/material";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import QuizAnalyticsTop from "../../components/Admin/QuizAnalyticsTop";
import QuizScore from "../../components/Admin/QuizScore";
import Header from "../../components/Header/Header";
import { getQuestion } from "../../hooks/admin";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../components/Error/NotFound";

const QuizAnalytics: React.FC = () => {
  const { text_id, question_id } = useParams();

  if (!text_id || !question_id) {
    return <NotFound />;
  }

  const { data: question } = getQuestion(text_id, question_id);

  const formatTick = (tick: number) => {
    return `${tick}%`;
  };

  const data = question.options.map((option, index) => {
    return {
      question: option,
      proportion: question.percentages[index],
    };
  });

  const correctAnswer = question.correct_option;
  const avgScore = Math.max(...question.percentages);

  return (
    <>
      <Header />
      <Box sx={{ marginLeft: "8vw", marginTop: "1vh", marginBottom: "1.5vh" }}>
        <Link to={`/admin/questions/${text_id}`}>
          <IconButton>
            <Box
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                color: "#D1D0C5",
                fontWeight: "bolder",
                fontSize: "1.5vw",
              }}
            >{`< back`}</Box>
          </IconButton>
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <QuizAnalyticsTop question={question.content} />
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
              tick={{ fill: "white", fontSize: "0.7vw", fontWeight: "bold" }}
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
