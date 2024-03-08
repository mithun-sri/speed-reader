import { Box } from "@mui/material";
import QuestionAnswer from "../../components/Results/QuestionAnswer";
import ResultsBottom from "../../components/Results/ResultsBottom";
import Score from "../../components/Results/Score";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ADAPTIVE_MODE } from "../../common/constants";
import { Result } from "../../api";

const ResultsPage: React.FC<{ notPlayAgain?: boolean }> = ({
  notPlayAgain,
}) => {
  const { averageWpm, intervalWpms, mode, quizContent, quizResults } =
    useGameContext();

  const wpmData = intervalWpms.map((wpm, index) => ({ index, wpm }));

  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 35;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 30));
  };

  const [fontSize, setFontSize] = useState(calculateFontSize());

  function calculateScore(results: Result[]): number {
    let score = 0;
    results.forEach((result) => {
      if (result.correct_option === result.selected_option) {
        score++;
      }
    });
    return score * 10;
  }

  const score = calculateScore(quizResults);

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
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bolder",
            color: "#D1D0C5",
            fontSize: fontSize,
          }}
        >
          Result
        </Box>
        <Box
          sx={{
            backgroundColor: "#323437",
            borderRadius: "50px",
            margin: "20px 10vw",
            padding: "10px 100px",
          }}
        >
          <Box
            sx={{
              margin: "3vh 10%",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Score score={score} />
            <Box
              sx={{
                width: "20vw",
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: "bolder",
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  fontSize: "3vw",
                }}
              >
                average wpm.
              </Box>
              <Box
                sx={{
                  fontSize: "4vw",
                  color: "#E2B714",
                  marginBottom: "2vh",
                  paddingLeft: "10vw",
                }}
              >
                {averageWpm}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  fontSize: "2vw",
                  marginBottom: "1vh",
                }}
              >
                <Box>min.</Box>
                <Box>max.</Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  fontSize: "2.3vw",
                  color: "#E2B714",
                }}
              >
                <Box>{Math.min(...intervalWpms)}</Box>
                <Box>{Math.max(...intervalWpms)}</Box>
              </Box>
            </Box>
          </Box>
          {mode === ADAPTIVE_MODE && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5vh",
              }}
            >
              <ResponsiveContainer width="70%" height={300}>
                <LineChart data={wpmData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" type="number" domain={[0, "dataMax"]}>
                    <Label
                      value="Time (s)"
                      position="insideBottom"
                      offset={-4}
                    />
                  </XAxis>
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="#E2B714"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
          <Box
            sx={{
              textAlign: "center",
              fontSize: fontSize,
              fontWeight: "bolder",
              fontFamily: "JetBrains Mono, monospace",
              color: "#fff",
              marginTop: "5vh",
            }}
          >
            Questions
          </Box>
          {quizContent?.map((question, index) => (
            <QuestionAnswer
              key={question.id}
              questionNumber={index + 1}
              question={question.content}
              questions={question.options}
              correctAnswer={quizResults[index].correct_option}
              userAnswer={quizResults[index].selected_option}
            />
          ))}
          {!notPlayAgain ? <ResultsBottom /> : null}
        </Box>
      </Box>
    </>
  );
};

export default ResultsPage;
