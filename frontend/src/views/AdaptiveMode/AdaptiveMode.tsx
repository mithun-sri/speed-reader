import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { calculateAverageWpm } from "../../common/constants";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { useGameContext } from "../../context/GameContext";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { useNextText } from "../../hooks/game";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const AdaptiveModeView = () => {
  const { setTextId, summarised } = useGameContext();
  const { data: text } = useNextText(summarised);

  const {
    resumeWebGazer,
    pauseWebGazer,
    disableWebGazerListener,
    enableWebGazerListener,
  } = useWebGazerContext();
  const [showGameScreen, setShowGameScreen] = useState(false);

  useEffect(() => {
    // NOTE:
    // This is a temporary fix to prevent the even loop from being busy
    // and not allowing the setTimeout to break in.
    disableWebGazerListener();
    pauseWebGazer();

    return () => {
      resumeWebGazer();
      enableWebGazerListener();
    };
  }, []);

  // TODO:
  // This is a temporary fix to prevent the infinite loop while rendering this component.
  // There may be a better way to do this if we restructure `GameContext`.
  useEffect(() => {
    setTextId(text.id);
  }, [text]);

  const startAdaptiveModeGame = () => {
    // NOTE:
    // This is a temporary fix to prevent the even loop from being busy
    // and not allowing the setTimeout to break in.
    resumeWebGazer();
    enableWebGazerListener();

    setShowGameScreen(true);
  };

  const countdownComp = (
    <Box
      sx={{
        marginTop: "100px",
      }}
    >
      <CountdownComponent
        duration={3}
        onCountdownFinish={startAdaptiveModeGame}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-20vh",
          padding: "25px",
        }}
      >
        {showGameScreen ? (
          <AdaptiveModeTextDisplay text={text.content} />
        ) : (
          countdownComp
        )}
      </Box>
    </Box>
  );
};

const AdaptiveModeTextDisplay: React.FC<{
  text: string;
  size?: number;
}> = ({ text }) => {
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

  const wordsArray = text.split(" ");
  const maxCharactersPerLine = 60;
  const leftCheckpoint = 0.5;
  const rightCheckpoint = 0.75;

  function calculateNextLineIndex(prevNextLineIndex: number): number {
    let lineLength = 0;
    for (let i = prevNextLineIndex; i < wordsArray.length; i++) {
      lineLength += wordsArray[i].length;
      if (lineLength > maxCharactersPerLine) {
        return i - 1;
      }
    }
    return wordsArray.length;
  }

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [nextLineIndex, setNextLineIndex] = useState(calculateNextLineIndex(0));
  const [lastLineChangeTime, setLastLineChangeTime] = useState(Date.now());
  const [hitLeftCheckpoint, setHitLeftCheckpoint] = useState(false);
  const { intervalWpms, setIntervalWpms, setAverageWpm } = useGameContext();
  const { gazeX } = useWebGazerContext();
  const { incrementCurrentStage } = useGameScreenContext();

  // NOTE:
  // Do not use `setWpm` from `GameContext` here,
  // as it will force this component to re-render from scratch
  const [wpm, setWpm] = useState<number>(200);

  // initialize intervalWpms list with initial wpm on component first render
  useEffect(() => {
    setIntervalWpms([wpm]);
  }, []);

  useEffect(() => {
    if (wordsArray.length > 0 && highlightedIndex === wordsArray.length - 1) {
      const avg_wpm = calculateAverageWpm(intervalWpms);
      setAverageWpm(avg_wpm);

      incrementCurrentStage();
      console.log("intervalWpms: ");
      console.log(intervalWpms);
    }
  }, [highlightedIndex]);

  // record WPM every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalWpms([...intervalWpms, wpm]);
    }, 2500);

    return () => clearInterval(interval);
  }, [wpm]);

  useEffect(() => {
    if (hitLeftCheckpoint && gazeX > window.innerWidth * rightCheckpoint) {
      const timeNow = Date.now();
      setWpm(
        (nextLineIndex - currentLineIndex) /
          ((timeNow - lastLineChangeTime) / 60000),
      );
      setLastLineChangeTime(timeNow);
      setCurrentLineIndex(nextLineIndex);
      setNextLineIndex(calculateNextLineIndex(nextLineIndex));
      setHitLeftCheckpoint(false);
    }

    if (!hitLeftCheckpoint) {
      setHitLeftCheckpoint(gazeX < window.innerWidth * leftCheckpoint);
    }
  }, [gazeX]);

  useEffect(() => {
    console.log("wpm: ", wpm);
    const updateHighlightedIndex = setInterval(() => {
      // NOTE:
      // Take `prevHighlightedIndex` as an argument
      // to avoid capturing the stale value of `highlightedIndex` in the callback closure.
      setHighlightedIndex((prevHighlightedIndex) =>
        Math.min(prevHighlightedIndex + 1, nextLineIndex - 1),
      );
    }, 60000 / wpm);

    return () => clearInterval(updateHighlightedIndex);
  }, [wpm]);

  return (
    <Box>
      <Box
        sx={{
          marginTop: "160px",
          width: "90vw",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          display: "flex",
          height: "200px",
          flexWrap: "wrap",
          fontSize: fontSize,
        }}
      >
        {wordsArray
          .slice(currentLineIndex, nextLineIndex)
          .map((word, index) => (
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
                  index <= highlightedIndex - currentLineIndex
                    ? "#E2B714"
                    : "#646669"
                }
              ></JetBrainsMonoText>
            </Box>
          ))}
      </Box>
      <Box
        sx={{
          width: "50%",
          paddingLeft: "25%",
          paddingTop: "200px",
        }}
      >
        <GameProgressBar
          gameProgress={(highlightedIndex / (wordsArray.length - 1)) * 100}
        />
      </Box>
    </Box>
  );
};

export default AdaptiveModeView;
