import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const QuestionAnswer: React.FC<{
  questionNumber: number;
  question: string;
  questions: string[];
  correctAnswer: number;
  userAnswer: number;
}> = ({ questionNumber, question, questions, correctAnswer, userAnswer }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 20));
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
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
      }}
    >
      <Box
        sx={{
          color: "#D1D0C5",
          fontSize: fontSize,
          textAlign: "center",
          margin: "40px 70px",
        }}
      >
        Q{questionNumber}. {question}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        {questions.map((element, index) => (
          <Box
            key={index}
            sx={{
              width: fontSize * 4,
              fontSize: fontSize / 2,
              backgroundColor:
                userAnswer !== index && index !== correctAnswer
                  ? "#E2B714"
                  : index === userAnswer && userAnswer !== correctAnswer
                    ? "#BF3B33"
                    : "#379F3B",
              border: "10px solid #646669",
              borderRadius: "28px",
              padding: `calc(${fontSize / 5}px) calc(${fontSize * 1.2}px)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            {element}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuestionAnswer;
