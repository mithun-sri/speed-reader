import { Box, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import BlurBox from "../../components/Blur/Blur";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import WpmSign from "../../components/WpmSign/WpmSign";
import { useTutorial } from "../../context/TutorialContext";
import "./Tutorial.css";

const INTRO_TEXT = [
  "Welcome to Speed Reader, your premier platform for unlocking the power of speed reading!",
  "Standard Mode lets you adjust the text speed manually, to challenge yourself and improve.",
  "Press the Up arrow key to increase the speed.",
  "Press the Down arrow key to decrease the speed.",
  "Press the spacebar to pause the game.",
  "It is important to not just read each word, but to understand the text you are reading...",
  "", // Which keys can you use to adjust the text speed in Standard Mode?
  "You'll be quizzed at the end of each game to prove you understood what you read.",
  "Adaptive Mode uses eye tracking to automatically adjust to your personal reading speed. Give it a try!",
];

const STAGE_START = -1;
const STAGE_UP_ARROW = 2;
const STAGE_DOWN_ARROW = 3;
const STAGE_SPACE = 4;
const STAGE_QUESTION = 6;
const VISITED_COOKIE = "visited";

function Tutorial() {
  const navigate = useNavigate();
  const { stage, setStage } = useTutorial();
  const [_, setCookie] = useCookies([VISITED_COOKIE]);
  const [wpm, setWpm] = useState(200);

  function endTutorial() {
    // NOTE:
    // Cookies without expiration date are deleted when the browser is closed.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_the_lifetime_of_a_cookie
    setCookie(VISITED_COOKIE, true, { expires: new Date("2100-01-01") });
    navigate("/signup");
  }

  function incrementStage() {
    if (stage < INTRO_TEXT.length - 1) setStage(stage + 1);
    else endTutorial();
  }

  function onTextFinish() {
    if (stage === STAGE_UP_ARROW) return;
    if (stage === STAGE_DOWN_ARROW) return;
    if (stage === STAGE_SPACE) return;
    incrementStage();
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      {stage === STAGE_START ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30vh",
          }}
        >
          <StartButton handleClick={incrementStage} />
        </Box>
      ) : stage === STAGE_QUESTION ? (
        <TutorialQuestion incrementStage={incrementStage} />
      ) : stage < STAGE_UP_ARROW || stage > STAGE_SPACE ? (
        <TutorialHighlightedTextDisplay
          text={INTRO_TEXT[stage]}
          wpm={wpm}
          setWpm={setWpm}
          stage={stage}
          onTextFinish={onTextFinish}
        />
      ) : (
        <TutorialWordTextDisplay
          text={INTRO_TEXT[stage]}
          wpm={wpm}
          setWpm={setWpm}
          onTextFinish={onTextFinish}
          stage={stage}
          incrementStage={incrementStage}
        />
      )}
      <SkipButton handleClick={endTutorial} />
      <Footer />
    </Box>
  );
}

const TutorialWordTextDisplay: React.FC<{
  text: string;
  wpm: number;
  setWpm: (newWpm: number) => void;
  onTextFinish: () => void;
  stage: number;
  incrementStage: () => void;
}> = ({ text, wpm, setWpm, onTextFinish, stage, incrementStage }) => {
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);

  useEffect(() => {
    setWordIndex(0);
    setWords(text.split(" "));
  }, [text]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === " ") {
        if (isPaused && stage === STAGE_SPACE) incrementStage();
        setPaused((prevPaused) => !prevPaused);
        return;
      }
      wpmAdjuster(event, wpm, setWpm);
      if (
        (stage === STAGE_UP_ARROW && event.code === "ArrowUp") ||
        (stage === STAGE_DOWN_ARROW && event.code === "ArrowDown")
      ) {
        incrementStage();
        return;
      }
    };
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [wpm, isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) setWordIndex((prevIndex) => prevIndex + 1);
    }, 60000 / wpm);

    return () => clearInterval(interval);
  }, [wpm, isPaused]);

  useEffect(() => {
    if (wordIndex === words.length) {
      onTextFinish();
      setWordIndex(0);
    }
  }, [wordIndex, words.length]);

  return (
    <Box sx={{ flex: 1 }}>
      {stage >= STAGE_UP_ARROW && <WpmSign wpm={wpm} />}
      {isPaused && <BlurBox />}
      <Box
        sx={{
          padding: "25px",
        }}
      >
        {highlightedWord({ word: words[wordIndex] })}
      </Box>
    </Box>
  );
};

TutorialWordTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  setWpm: PropTypes.func.isRequired,
  onTextFinish: PropTypes.func.isRequired,
  stage: PropTypes.number.isRequired,
  incrementStage: PropTypes.func.isRequired,
};

const wpmAdjuster = (
  event: KeyboardEvent,
  wpm: number,
  setWpm: (newWpm: number) => void,
): void => {
  if (event.code === "ArrowUp") {
    console.log("ArrowUp");
    const new_wpm = wpm + 10;
    setWpm(new_wpm);
    console.log(new_wpm);
  }
  if (event.code === "ArrowDown") {
    console.log("ArrowDown");
    const new_wpm = Math.max(wpm - 10, 1);
    setWpm(new_wpm);
    console.log(new_wpm);
  }
};

const highlightedWord: React.FC<{
  word: string;
}> = ({ word }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 16;
    const maxFontSize = 48;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
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
        fontSize: fontSize,
        color: "#E2B714",
        fontWeight: "bolder",
        textAlign: "center",
        marginTop: "200px",
      }}
    >
      {word}
    </Box>
  );
};

const TutorialHighlightedTextDisplay: React.FC<{
  text: string;
  wpm: number;
  setWpm: (newWpm: number) => void;
  stage: number;
  onTextFinish: () => void;
}> = ({ text, wpm, setWpm, stage, onTextFinish }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);

  const wordsPerFrame = 30;
  const wordsArray = text.split(" ");

  useEffect(() => {
    setWordIndex(0);
    setHighlightedIndex(0);
  }, [text]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === " ") {
        setPaused((prevPaused) => !prevPaused);
        return;
      }
      wpmAdjuster(event, wpm, setWpm);
    };
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [wpm, isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setHighlightedIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          setWordIndex(newIndex);
          return newIndex < wordsArray.length ? newIndex : prevIndex;
        });
      }
    }, 60000 / wpm);

    return () => {
      clearInterval(interval);
    };
  }, [text, wpm, isPaused]);

  useEffect(() => {
    if (wordIndex === wordsArray.length) onTextFinish();
  }, [wordIndex, wordsArray.length]);

  const currentFrameIndex = Math.floor(highlightedIndex / wordsPerFrame);
  const visibleText = text
    .split(" ")
    .slice(
      currentFrameIndex * wordsPerFrame,
      (currentFrameIndex + 1) * wordsPerFrame,
    )
    .join(" ");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
      }}
    >
      {stage >= STAGE_UP_ARROW && <WpmSign wpm={wpm} />}
      {isPaused && <BlurBox />}
      <Box
        sx={{
          marginTop: "160px",
          width: "50vw",
          padding: "10px",
          display: "flex",
          height: "200px",
          flexWrap: "wrap",
        }}
      >
        {visibleText.split(" ").map((word, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              margin: "0.4em",
            }}
          >
            <JetBrainsMonoText
              text={word}
              size={window.innerWidth / 60}
              color={
                index <= highlightedIndex % wordsPerFrame
                  ? "#E2B714"
                  : "#646669"
              }
            ></JetBrainsMonoText>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

TutorialHighlightedTextDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  wpm: PropTypes.number.isRequired,
  setWpm: PropTypes.func.isRequired,
  stage: PropTypes.number.isRequired,
  onTextFinish: PropTypes.func.isRequired,
};

const TutorialQuestion: React.FC<{
  incrementStage: () => void;
}> = ({ incrementStage }) => {
  const [selectedOption, setSelectedOption] = useState(-1);

  const getOptionClass = (optionIndex: number) => {
    if (selectedOption === -1) return "";
    if (optionIndex === 2) return "correct";
    if (selectedOption === optionIndex) return "incorrect";
    return "";
  };

  function onClickOption(optionIndex: number) {
    if (selectedOption === -1) setSelectedOption(optionIndex);
  }

  useEffect(() => {
    if (selectedOption !== -1) {
      const nextStageTimeout = setTimeout(() => {
        incrementStage();
      }, 2000);
      return () => clearTimeout(nextStageTimeout);
    }
  }, [selectedOption]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
      }}
    >
      <div id={`tutorial-question`} className="question-container">
        <JetBrainsMonoText
          text={
            "Which keys can you use to adjust the text speed in Standard Mode?"
          }
          size={35}
          color="#D1D0C5"
        />
        <div className="options-container">
          {["W and S", "Q and E", "Up and Down arrows"].map(
            (option: any, optionIndex: any) => (
              <IconButton
                key={optionIndex}
                sx={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#FEFAD4",
                  fontSize: 25,
                  fontWeight: "bolder",
                }}
                onClick={() => onClickOption(optionIndex)}
                data-cy={`question-option${optionIndex}`}
              >
                <Box
                  sx={{
                    border: "4px solid #646669",
                    borderRadius: "30px",
                    borderColor: "#646669",
                    background: "#E2B714",
                    width: "90%",
                    padding: "21px",
                    margin: "7px 0",
                    cursor: "pointer",
                    transition: "background-color 0.1s, border-color 0.1s",
                    "&:hover": {
                      background: "#a6850f",
                    },
                    "&.correct": {
                      background: "#379F3B",
                    },
                    "&.incorrect": {
                      background: "#BF3B33",
                    },
                  }}
                  className={getOptionClass(optionIndex)}
                >
                  {option}
                </Box>
              </IconButton>
            ),
          )}
        </div>
      </div>
    </Box>
  );
};

TutorialQuestion.propTypes = {
  incrementStage: PropTypes.func.isRequired,
};

const SkipButton: React.FC<{
  handleClick?: () => void;
}> = ({ handleClick }) => {
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

  function calculateFontSize() {
    const windowWidth = window.innerWidth;
    const minSize = 40;
    const maxSize = 180;
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 6),
    );
    return calculatedSize;
  }

  return (
    <IconButton
      onClick={() => {
        handleClick ? handleClick() : () => {};
      }}
      sx={{
        height: fontSize / 3.6,
        fontFamily: "JetBrains Mono, monospace",
        color: "#D1D0C5",
        fontWeight: "bolder",
        fontSize: fontSize / 6.8,
      }}
    >
      {`skip tutorial >`}
    </IconButton>
  );
};

const StartButton: React.FC<{
  handleClick?: () => void;
}> = ({ handleClick }) => {
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

  function calculateFontSize() {
    const windowWidth = window.innerWidth;
    const minSize = 40;
    const maxSize = 180;
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 6),
    );
    return calculatedSize;
  }

  return (
    <IconButton
      onClick={() => {
        handleClick ? handleClick() : () => {};
      }}
      sx={{
        height: fontSize / 3.6,
        fontFamily: "JetBrains Mono, monospace",
        color: "#E2B714",
        fontWeight: "bolder",
        fontSize: fontSize / 6.8,
      }}
    >
      {`Click here to start!`}
    </IconButton>
  );
};

export default Tutorial;
