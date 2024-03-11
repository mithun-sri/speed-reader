import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { calculateAverageWpm } from "../../common/constants";
import BlurBox from "../../components/Blur/Blur";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { GameViewType, useGameContext } from "../../context/GameContext";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { useNextText, useTextById } from "../../hooks/game";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const AdaptiveModeView = () => {
  const { setTextId, summarised, difficulty } = useGameContext();
  const { textId_, pauseWebGazer, resumeWebGazer } = useWebGazerContext();

  useEffect(() => {
    return () => {
      pauseWebGazer();
    };
  }, []);

  const getText = () => {
    if (textId_ !== null) {
      setTextId(textId_);
      return useTextById(textId_);
    } else {
      const text = useNextText(
        summarised,
        difficulty?.toLowerCase() || undefined,
      );
      setTextId(text.data.id);
      return text;
    }
  };
  const { data: text } = getText();

  const [showGameScreen, setShowGameScreen] = useState(false);

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
          <AdaptiveModeTextDisplay
            // TODO:
            // OpenAPI generator fails to interpret Python's `Optional` type
            // and assigns `interface{}` to `summary`.
            wordsArray={
              summarised
                ? (text.summary as string).split(" ")
                : text.content.split(" ")
            }
          />
        ) : (
          <Box
            sx={{
              marginTop: "100px",
            }}
          >
            <CountdownComponent
              duration={3}
              onCountdownFinish={() => {
                resumeWebGazer();
                setShowGameScreen(true);
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

const AdaptiveModeTextDisplay: React.FC<{
  wordsArray: string[];
  size?: number;
}> = ({ wordsArray }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 16;
    const maxFontSize = 48;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 15));
  };

  const [fontSize, setFontSize] = useState(calculateFontSize());
  const [isPaused, setPaused] = useState(false);
  const { intervalWpms, setIntervalWpms, setAverageWpm, setView } =
    useGameContext();

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    setView(GameViewType.AdaptiveHighlighted);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === " ") setPaused((prevPaused) => !prevPaused);
    };
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [isPaused]);

  const [hitLeftCheckpoint, setHitLeftCheckpoint] = useState(false);
  const [hitRightCheckpoint, setHitRightCheckpoint] = useState(false);
  const leftCheckpointRatio = 0.3;
  const [rightCheckpointRatioSum, setRightCheckpointRatioSum] = useState(0.8);
  const [rightCheckpointRatioEntries, setRightCheckpointRatioEntries] =
    useState(1);

  const { setWebGazerListener, clearWebGazerListener } = useWebGazerContext();

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [nextLineIndex, setNextLineIndex] = useState(calculateNextLineIndex(0));
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const lineContainer = useRef<HTMLDivElement>(null);
  const [lineContainerWidth, updateLineContainerWidth] = useState(
    window.innerWidth,
  );
  const prevPivotPosition = useRef<number>(lineContainerWidth * 0.8);
  const prevGazePosition = useRef<{ x: number; y: number }>({
    x: lineContainerWidth * 0.8,
    y: 0,
  });
  const prevDirection = useRef<string | null>("left");
  const pageCenter = window.innerWidth / 2;

  useEffect(() => {
    if (lineContainer.current) {
      updateLineContainerWidth(lineContainer.current.offsetWidth);
    }
  }, [lineContainer.current?.offsetWidth]);

  useEffect(() => {
    setHighlightedIndex(currentLineIndex);
  }, [currentLineIndex]);

  useEffect(() => {
    setWebGazerListener((data: any, _: any) => {
      if (data === null || isPaused) return;

      const deltaX = data.x - prevPivotPosition.current;
      const newDirection =
        data.x - prevGazePosition.current.x > 0 ? "right" : "left";
      const directionChangeThreshold = lineContainerWidth / 3;

      const wordToHighlightIndex = highlightedIndex - currentLineIndex + 1;
      if (
        newDirection === "right" &&
        hitLeftCheckpoint &&
        wordToHighlightIndex < nextLineIndex - currentLineIndex
      ) {
        const wordContainer = lineContainer.current?.children[
          wordToHighlightIndex - 1
        ] as HTMLElement;

        if (wordContainer && data.x >= wordContainer.offsetLeft) {
          setHighlightedIndex(highlightedIndex + 1);
        }
      }

      let newRightCheckpointRatioSum = rightCheckpointRatioSum;
      let newRightCheckpointRatioEntries = rightCheckpointRatioEntries;

      if (prevDirection.current !== newDirection) {
        if (deltaX < -directionChangeThreshold) {
          const newLeftCheckpointRatio =
            0.5 - (pageCenter - data.x) / lineContainerWidth;
          if (
            newLeftCheckpointRatio > 0 &&
            newLeftCheckpointRatio <
              newRightCheckpointRatioSum / newRightCheckpointRatioEntries
          ) {
            prevDirection.current = newDirection;
            prevPivotPosition.current = data.x;
          }
        } else if (deltaX > directionChangeThreshold) {
          const newRightCheckpointRatio =
            0.5 + (data.x - pageCenter) / lineContainerWidth;
          if (
            newRightCheckpointRatio < 1 &&
            newRightCheckpointRatio > leftCheckpointRatio
          ) {
            newRightCheckpointRatioSum =
              rightCheckpointRatioSum + newRightCheckpointRatio;
            newRightCheckpointRatioEntries++;

            prevDirection.current = newDirection;
            prevPivotPosition.current =
              (lineContainerWidth * newRightCheckpointRatioSum) /
              newRightCheckpointRatioEntries;
          }
        }
      }

      const leftCheckpoint =
        pageCenter - (0.5 - leftCheckpointRatio) * lineContainerWidth;
      const rightCheckpoint =
        pageCenter +
        (newRightCheckpointRatioSum / newRightCheckpointRatioEntries - 0.5) *
          lineContainerWidth;

      if (!hitLeftCheckpoint && data.x < leftCheckpoint) {
        setHitLeftCheckpoint(true);
      }
      if (
        !hitRightCheckpoint &&
        hitLeftCheckpoint &&
        data.x > rightCheckpoint
      ) {
        setHitRightCheckpoint(true);
      }

      console.log(
        "right ratio: ",
        newRightCheckpointRatioSum / newRightCheckpointRatioEntries,
      );

      setRightCheckpointRatioSum(newRightCheckpointRatioSum);
      setRightCheckpointRatioEntries(newRightCheckpointRatioEntries);
      prevGazePosition.current = { x: data.x, y: data.y };
    });

    return () => clearWebGazerListener();
  }, [
    hitLeftCheckpoint,
    hitRightCheckpoint,
    lineContainerWidth,
    leftCheckpointRatio,
    rightCheckpointRatioSum,
    rightCheckpointRatioEntries,
    prevGazePosition.current,
    prevDirection.current,
    highlightedIndex,
    currentLineIndex,
    nextLineIndex,
    isPaused,
  ]);

  function calculateNextLineIndex(prevNextLineIndex: number): number {
    const maxCharsPerLine = 60;
    let chars = 0;
    for (let i = prevNextLineIndex; i < wordsArray.length; i++) {
      chars += wordsArray[i].length;
      if (chars > maxCharsPerLine) return i - 1;
    }
    return wordsArray.length;
  }

  // NOTE:
  // Do not use `setWpm` from `GameContext` here,
  // as it will force this component to re-render from scratch
  const [wpm, setWpm] = useState<number>(200);
  const [lastLineChangeTime, setLastLineChangeTime] = useState(Date.now());
  const { incrementCurrentStage } = useGameScreenContext();

  useEffect(() => {
    if (isPaused) return;

    const noWords = nextLineIndex - currentLineIndex;
    const currLineHighlightedWords = highlightedIndex - currentLineIndex;
    const minHighlightedWords = Math.floor(
      (rightCheckpointRatioSum / rightCheckpointRatioEntries) * noWords,
    );

    if (
      (hitLeftCheckpoint &&
        hitRightCheckpoint &&
        currLineHighlightedWords >= minHighlightedWords) ||
      highlightedIndex === nextLineIndex - 1
    ) {
      const timeNow = Date.now();
      setWpm(
        (nextLineIndex - currentLineIndex) /
          ((timeNow - lastLineChangeTime) / 60000),
      );
      setLastLineChangeTime(timeNow);

      if (
        nextLineIndex === wordsArray.length ||
        highlightedIndex === wordsArray.length - 1
      ) {
        console.log("intervalWpms: ", intervalWpms);
        setAverageWpm(calculateAverageWpm(intervalWpms));
        incrementCurrentStage();
        return;
      }

      setCurrentLineIndex(nextLineIndex);
      setNextLineIndex(calculateNextLineIndex(nextLineIndex));
      setHitLeftCheckpoint(false);
      setHitRightCheckpoint(false);
    }
  }, [hitLeftCheckpoint, hitRightCheckpoint, highlightedIndex, isPaused]);

  useEffect(() => {
    // Record wpm every 1 second.
    const recordIntervalWpms = setInterval(() => {
      if (!isPaused) {
        setIntervalWpms(intervalWpms ? [...intervalWpms, Math.floor(wpm)] : []);
      }
    }, 1000);

    return () => clearInterval(recordIntervalWpms);
  }, [wpm, intervalWpms, isPaused]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isPaused && <BlurBox />}
      <Box
        ref={lineContainer}
        sx={{
          marginTop: "160px",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          display: "flex",
          height: "200px",
          flexWrap: "wrap",
          fontSize: fontSize,
          maxWidth: "100%",
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
