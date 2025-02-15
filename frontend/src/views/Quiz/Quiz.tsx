import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import "./Quiz.css";

import { useEffect } from "react";
import { ADAPTIVE_MODE, STANDARD_MODE } from "../../common/constants";
import { GameViewType, useGameContext } from "../../context/GameContext";
import { useNextQuestions, usePostAnswers } from "../../hooks/game";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";
import { useWebGazerContext } from "../../context/WebGazerContext";

const QuizView = () => {
  const { incrementCurrentStage } = useGameScreenContext();
  const {
    textId,
    mode,
    view,
    summarised,
    quizAnswers,
    averageWpm,
    intervalWpms,
    setQuizAnswers,
    setQuizResults,
    modifyQuizAnswer,
    setQuizContent,
  } = useGameContext();
  const { data: questions } = useNextQuestions(textId);
  const nextQuestion = quizAnswers.indexOf(null);

  useEffect(() => {
    if (questions) {
      setQuizAnswers(new Array(questions.length).fill(null));
      setQuizContent(questions);
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

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const { setTextId_ } = useWebGazerContext();

  const postAnswers = usePostAnswers(textId);
  const moveToResults = () => {
    setTimeout(() => {
      if (mode !== null && view !== null) {
        const gameMode = {
          [STANDARD_MODE]: "standard",
          [ADAPTIVE_MODE]: "adaptive",
        }[mode];
        const gameSubmode = {
          [GameViewType.StandardWord]: "word-by-word",
          [GameViewType.StandardHighlighted]: "highlight",
          [GameViewType.StandardPeripheral]: "peripheral",
          [GameViewType.AdaptiveHighlighted]: "single-line-highlight",
        }[view];
        postAnswers.mutate(
          {
            answers: quizAnswers.map((selectedOption, questionIndex) => ({
              question_id: questions![questionIndex].id,
              selected_option: selectedOption!,
            })),
            average_wpm: averageWpm,
            interval_wpms: intervalWpms,
            game_mode: gameMode,
            game_submode: gameSubmode,
            summary: summarised,
          },
          {
            onSuccess: (res: any) => {
              console.log("Answers posted successfully: ", res?.data);
              setQuizResults(res?.data);
              scrollToTop();
              setTextId_(null);
              incrementCurrentStage();
            },
            onError: (err: any) => {
              console.error("Failed to post answers: ", err);
              document
                .getElementById("post-answers-error")
                ?.style.setProperty("display", "block");
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
                  <IconButton
                    key={optionIndex}
                    sx={{
                      fontFamily: "JetBrains Mono, monospace",
                      color: "#FEFAD4",
                      fontSize: 25,
                      fontWeight: "bolder",
                    }}
                    onClick={() => modifyQuizAnswer(index, optionIndex)}
                    data-cy={`question${index}-option${optionIndex}`}
                  >
                    <Box
                      sx={{
                        border: "4px solid #646669",
                        borderRadius: "30px",
                        background: "#E2B714",
                        width: "100%",
                        padding: "21px",
                        margin: "7px 0",
                        cursor: "pointer",
                        transition: "background-color 0.1s, border-color 0.1s",
                        "&:hover": {
                          background: "#57757c",
                          borderColor: "#646669",
                        },
                        "&.selected": {
                          background: "#57757c",
                          borderColor: "#646669",
                        },
                      }}
                      className={getOptionClass(index, optionIndex)}
                    >
                      {option}
                    </Box>
                  </IconButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {allQuestionsAnswered && (
        <Box>
          <Box
            id="post-answers-error"
            sx={{
              display: "none",
              marginBottom: "20px",
            }}
          >
            <JetBrainsMonoText
              text={"Error submitting answers, please try again."}
              size={25}
              color="#ff5c33"
            />
          </Box>
          <IconButton
            id="submit"
            sx={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#FFFFFF",
            }}
            onClick={moveToResults}
          >
            <Box
              sx={{
                border: "10px solid #646669",
                borderRadius: "30px",
                background: "#E2B714",
                padding: "10px 60px 10px 60px",
                marginBottom: "10vh",
                fontWeight: "bolder",
                fontSize: 35,
                cursor: "pointer",
              }}
            >
              Submit
            </Box>
          </IconButton>
        </Box>
      )}
    </div>
  );
};

export default QuizView;
