import { Box } from "@mui/material";
import QuestionAnswer from "../../components/Results/QuestionAnswer";
import Score from "../../components/Results/Score";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useParams } from "react-router-dom";
// import { getHistory } from "../../hooks/users";
// import NotFound from "../../components/Error/NotFound";

const HistoricalResultsPage: React.FC = () => {
  const { text_id } = useParams<{ text_id?: string }>();

  console.log(text_id);
  // if (!text_id) {
  // return <NotFound />;
  //   }

  // const { data: gameHistory } = getHistory(text_id);

  // const { average_wpm, interval_wpms, score, game_mode, results } = gameHistory;

  const average_wpm = 200;
  const interval_wpms = [200, 200, 200, 200, 200, 200];
  const score = 78;
  const game_mode = "adaptive";
  const results = [
    {
      question_id: 1,
      question: "Why did the chicken cross the road?",
      options: ["he was hungry", "he was not hungry", "he was sick"],
      correct_option: 1,
      selected_option: 1,
    },
  ];

  const wpmData = interval_wpms.map((wpm, index) => ({ index, wpm }));

  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 35;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 30));
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
            margin: "20px 100px",
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
                {average_wpm}
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
                <Box>{Math.min(...interval_wpms)}</Box>
                <Box>{Math.max(...interval_wpms)}</Box>
              </Box>
            </Box>
          </Box>
          {game_mode == "adaptive" && (
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
                  <XAxis dataKey="index" type="number" />
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="#E2B714"
                    activeDot={{ r: 8 }}
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
          {results?.map((question, index) => (
            <QuestionAnswer
              key={question.question_id}
              questionNumber={index + 1}
              question={question.question}
              questions={question.options}
              correctAnswer={question.correct_option}
              userAnswer={question.selected_option}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default HistoricalResultsPage;
