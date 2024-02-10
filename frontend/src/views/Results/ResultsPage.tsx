import { Box } from "@mui/material";
import QuestionAnswer from "../../components/Results/QuestionAnswer";
import ResultsBottom from "../../components/Results/ResultsBottom";
import Score from "../../components/Results/Score";

const ResultsPage: React.FC<{ playAgain?: boolean }> = ({ playAgain }) => {
  return (
    <Box>
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          color: "#D1D0C5",
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
        <Score score={65} />
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
  );
};

export default ResultsPage;
