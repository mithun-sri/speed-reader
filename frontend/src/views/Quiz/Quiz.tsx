import { Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import "./Quiz.css";
import axios from "axios";

import { useEffect, useState } from "react";

type Question = {
  text: string;
  options: string[];
  correctIndex: number;
};

const QuizView = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "/api/v1/game/texts/questions/1",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        for (let i = 0; i < response.data.questions.length; i++) {
          const question: Question = {
            text: response.data.questions[i].question_text,
            options: [
              response.data.questions[i].option_a,
              response.data.questions[i].option_b,
              response.data.questions[i].option_c,
            ],
            correctIndex: response.data.questions[i].correct_option,
          };
          setQuestions((questions) => [...questions, question]);
          setSelectedOptions((selectedOptions) => [...selectedOptions, null]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleOptionClick = (questionIndex: number, optionIndex: number) => {
    // Check if the clicked question is the current answerable question
    if (questionIndex !== currentQuestion) return;

    // Prevent changing the answer if already selected
    if (selectedOptions[questionIndex] != null) return;

    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);

    // Auto-scroll to next question
    if (questionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);

        const nextQuestionId = `question-${questionIndex + 1}`;
        const nextQuestionContainer = document.getElementById(nextQuestionId);
        if (nextQuestionContainer) {
          nextQuestionContainer.scrollIntoView({
            behavior: "smooth",
            block: "center", // Scroll to the center of the next question
          });
        }
      }, 500);
    }
  };

  const getOptionClass = (questionIndex: number, optionIndex: number) => {
    const selectedOptionIndex = selectedOptions[questionIndex];
    const isCorrectOption =
      questions[questionIndex].correctIndex === optionIndex;
    const isIncorrectSelected =
      selectedOptionIndex !== null &&
      selectedOptionIndex !== questions[questionIndex].correctIndex;

    if (selectedOptionIndex === optionIndex) {
      return isCorrectOption ? "correct" : "incorrect";
    } else if (isIncorrectSelected && isCorrectOption) {
      return "correct"; // Highlight the correct option if a wrong one is selected
    }
    return "";
  };

  // Calculate the score based on selected options
  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedOptions[i] === questions[i].correctIndex) {
        score++;
      }
    }
    return score;
  };

  const allQuestionsAnswered = selectedOptions.every(
    (option) => option !== null,
  );
  const score = calculateScore();

  useEffect(() => {
    if (allQuestionsAnswered) {
      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start", // Scroll to the top of the results section
          });
        }
      }, 500);
    }
  }, [allQuestionsAnswered]);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="Quiz">
      <Header />
      <div className="quiz-questions-screen">
        <div className="quiz-questions-container">
          {questions.map((question, index) => (
            <div
              key={index}
              id={`question-${index}`}
              className={`question-container ${currentQuestion === index ? "current" : ""}`}
            >
              <JetBrainsMonoText
                text={"Q. " + question.text}
                size={35}
                color="#D1D0C5"
              />
              <div className="options-container">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    onClick={() => handleOptionClick(index, optionIndex)}
                    className={`option ${getOptionClass(index, optionIndex)}`}
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
        <div className="results-section" id="results-section">
          <div className="results-content">
            <JetBrainsMonoText
              text={"Congratulations!"}
              size={45}
              color="#D1D0C5"
            />
            <JetBrainsMonoText
              text={"Your Score: " + score + "/" + questions.length}
              size={35}
              color="#D1D0C5"
            />
          </div>
          <IconButton
            sx={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#FFFFFF",
            }}
          >
            <Link
              to="/pre-game"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Box
                sx={{
                  border: "10px solid #646669",
                  borderRadius: "30px",
                  background: "#E2B714",
                  padding: "10px 60px 10px 60px",
                  fontWeight: "bolder",
                  fontSize: 35,
                  cursor: "pointer", // Add cursor pointer for better UX
                }}
                onClick={scrollToTop} // Attach the scrollToTop function to onClick
              >
                Play Again
              </Box>
            </Link>
          </IconButton>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default QuizView;
