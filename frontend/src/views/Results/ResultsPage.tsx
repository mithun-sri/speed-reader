import { Box } from "@mui/material";
import QuestionAnswer from "../../components/Results/QuestionAnswer";
import ResultsBottom from "../../components/Results/ResultsBottom";
import Score from "../../components/Results/Score";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import UserData from "../../components/User/UserData";

const ResultsPage: React.FC<{ playAgain?: boolean }> = ({ playAgain }) => {
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

  // Make request to backend

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
              margin: "0px 10%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Score score={65} />
            <UserData title="average wpm." value="20" size={fontSize} />
          </Box>
          {/* iterate over response from server and render QuestionAnswer */}
          <Box
            sx={{
              textAlign: "center",
              fontSize: fontSize,
              fontWeight: "bolder",
              fontFamily: "JetBrains Mono, monospace",
              color: "#fff",
              margin: "20px",
            }}
          >
            Questions
          </Box>
          <QuestionAnswer
            questionNumber={1}
            question={"Why did the chicken cross the road?"}
            questions={["he was hungry", "he was not hungry", "he was hungry"]}
            correctAnswer={0}
            userAnswer={2}
          />
          <QuestionAnswer
            questionNumber={2}
            question={"Why did the chicken not cross the road?"}
            questions={[
              "he was hungry",
              "he was very very not hungry",
              "he was hungry",
            ]}
            correctAnswer={1}
            userAnswer={1}
          />
          {playAgain ? <ResultsBottom /> : null}
        </Box>
      </Box>
    </>
  );
};

export default ResultsPage;
