import { Box, IconButton } from "@mui/material";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import "./Quiz.css";

import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext";
import { useNextQuestions, usePostAnswers } from "../../hooks/game";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";

const QuizView = () => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { textId, mode, view, quizAnswers, setQuizAnswers, modifyQuizAnswer } =
    useGameContext();
  const { data: questions } = useNextQuestions(textId);
  const nextQuestion = quizAnswers.indexOf(null);

  useEffect(() => {
    if (questions) {
      setQuizAnswers(new Array(questions.length).fill(null));
    }
  }, [questions]);

  useEffect(() => {
    let nextComponentContainer = document.getElementById("submit");
    if (nextQuestion !== -1) {
      nextComponentContainer = document.getElementById(
        `question-${nextQuestion}`,
      );
    }

    // Auto-scroll to next question or submit button if all questions are answered
    setTimeout(() => {
      if (nextComponentContainer) {
        nextComponentContainer.scrollIntoView({
          behavior: "smooth",
          block: "center", // Scroll to the center of the next question
        });
      }
    }, 500);
  }, [quizAnswers]);

  const getOptionClass = (questionIndex: number, optionIndex: number) =>
    quizAnswers[questionIndex] === optionIndex ? "selected" : "";

  const allQuestionsAnswered = quizAnswers.every((option) => option !== null);

  const postAnswers = usePostAnswers(textId);
  const moveToResults = () => {
    setTimeout(() => {
      if (mode !== null && view !== null) {
        postAnswers.mutate(
          {
            answers: quizAnswers.map((selectedOption, questionIndex) => ({
              questionId: questions![questionIndex].id,
              selectedOption: selectedOption!,
            })),
            averageWpm: 0,
            intervalWpms: [0, 0, 0],
            gameMode: mode,
            gameSubmode: "word-by-word",
            summary: true,
          },
          {
            onSuccess: (res: any) => {
              console.log("Answers posted successfully: ", res?.data);
              incrementCurrentStage();
            },
            onError: (err: any) => {
              console.error("Failed to post answers: ", err);
            },
          },
        );
      }
    }, 500);
  };

  return (
    <div className="Quiz">
      <Header />
      <div className="quiz-questions-screen">
        <div className="quiz-questions-container">
          {questions.map((question: any, index: any) => (
            <div
              key={index}
              id={`question-${index}`}
              className="question-container"
            >
              <JetBrainsMonoText
                text={`Q${index + 1}. ` + question.content}
                size={35}
                color="#D1D0C5"
              />
              <div className="options-container">
                {question.options.map((option: any, optionIndex: any) => (
                  <div
                    key={optionIndex}
                    onClick={() => modifyQuizAnswer(index, optionIndex)}
                    className={`option ${getOptionClass(index, optionIndex)}`}
                    data-cy={`question${index}-option${optionIndex}`}
                  >
                    <JetBrainsMonoText
                      text={option}
                      size={25}
                      color="#FEFAD4   "
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {allQuestionsAnswered && (
        <IconButton
          id="submit"
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              border: "10px solid #646669",
              borderRadius: "30px",
              background: "#E2B714",
              padding: "10px 60px 10px 60px",
              fontWeight: "bolder",
              fontSize: 35,
              cursor: "pointer",
            }}
            onClick={moveToResults}
          >
            Submit
          </Box>
        </IconButton>
      )}
      <Footer />
    </div>
  );
};

export default QuizView;
