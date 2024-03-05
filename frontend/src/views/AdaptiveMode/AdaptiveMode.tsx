import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { calculateAverageWpm } from "../../common/constants";
import CountdownComponent from "../../components/Counter/Counter";
import Header from "../../components/Header/Header";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { GameViewType, useGameContext } from "../../context/GameContext";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { useNextText } from "../../hooks/game";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const AdaptiveModeView = () => {
  const { setTextId, summarised } = useGameContext();
  const { resumeWebGazer } = useWebGazerContext();
  const { data: text } = useNextText(summarised);

  const [showGameScreen, setShowGameScreen] = useState(false);

  // TODO:
  // This is a temporary fix to prevent the infinite loop while rendering this component.
  // There may be a better way to do this if we restructure `GameContext`.
  useEffect(() => {
    setTextId(text.id);
  }, [text]);

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
            text={summarised ? (text.summary as string) : text.content}
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

  const [hitLeftCheckpoint, setHitLeftCheckpoint] = useState(false);
  const [hitRightCheckpoint, setHitRightCheckpoint] = useState(false);
  const [leftCheckpointRatioSum, setLeftCheckpointRatioSum] = useState(0.2);
  const [rightCheckpointRatioSum, setRightCheckpointRatioSum] = useState(0.9);
  const [leftCheckpointRatioEntries, setLeftCheckpointRatioEntries] =
    useState(1);
  const [rightCheckpointRatioEntries, setRightCheckpointRatioEntries] =
    useState(1);

  const prevGazePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevDirection = useRef<string | null>("left");
  const directionChangeThreshold = 100;
  const [lineContainerWidth, setLineContainerWidth] = useState(
    window.innerWidth,
  );
  const { setWebGazerListener, clearWebGazerListener } = useWebGazerContext();

  const updateLineContainerWidth = (width: number) => {
    setLineContainerWidth(width);
  };

  useEffect(() => {
    setWebGazerListener((data: any, _: any) => {
      if (data === null) return;
      const pageCenter = window.innerWidth / 2;

      const deltaX = data.x - prevGazePosition.current.x;
      let newleftCheckpointRatioSum = leftCheckpointRatioSum;
      let newRightCheckpointRatioSum = rightCheckpointRatioSum;
      let newLeftCheckpointRatioEntries = leftCheckpointRatioEntries;
      let newRightCheckpointRatioEntries = rightCheckpointRatioEntries;
      if (
        deltaX > directionChangeThreshold &&
        prevDirection.current !== "right"
      ) {
        const newLeftCheckpointRatio =
          0.5 - (pageCenter - prevGazePosition.current.x) / lineContainerWidth;
        if (
          newLeftCheckpointRatio > 0 &&
          newLeftCheckpointRatio <
            newRightCheckpointRatioSum / newRightCheckpointRatioEntries
        ) {
          newleftCheckpointRatioSum =
            leftCheckpointRatioSum + newLeftCheckpointRatio;
          newLeftCheckpointRatioEntries++;
        }
        prevDirection.current = "right";
      } else if (
        deltaX < -directionChangeThreshold &&
        prevDirection.current !== "left"
      ) {
        const newRightCheckpointRatio =
          0.5 + (prevGazePosition.current.x - pageCenter) / lineContainerWidth;
        if (
          newRightCheckpointRatio < 1 &&
          newRightCheckpointRatio >
            newleftCheckpointRatioSum / newLeftCheckpointRatioEntries
        ) {
          newRightCheckpointRatioSum =
            rightCheckpointRatioSum + newRightCheckpointRatio;
          newRightCheckpointRatioEntries++;
        }
        prevDirection.current = "left";
      }

      const leftCheckpoint =
        pageCenter -
        (0.5 - newleftCheckpointRatioSum / newLeftCheckpointRatioEntries) *
          lineContainerWidth;
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

      setLeftCheckpointRatioSum(newleftCheckpointRatioSum);
      setRightCheckpointRatioSum(newRightCheckpointRatioSum);
      setLeftCheckpointRatioEntries(newLeftCheckpointRatioEntries);
      setRightCheckpointRatioEntries(newRightCheckpointRatioEntries);
      prevGazePosition.current = { x: data.x, y: data.y };
    });

    return () => clearWebGazerListener();
  }, [
    hitLeftCheckpoint,
    hitRightCheckpoint,
    lineContainerWidth,
    leftCheckpointRatioSum,
    rightCheckpointRatioSum,
    leftCheckpointRatioEntries,
    rightCheckpointRatioEntries,
    prevGazePosition.current,
    prevDirection.current,
  ]);

  const wordsArray = text.split(" ");

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
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [nextLineIndex, setNextLineIndex] = useState(calculateNextLineIndex(0));
  const [lastLineChangeTime, setLastLineChangeTime] = useState(Date.now());
  const { incrementCurrentStage } = useGameScreenContext();

  useEffect(() => {
    if (hitLeftCheckpoint && hitRightCheckpoint) {
      const timeNow = Date.now();
      setWpm(
        (nextLineIndex - currentLineIndex) /
          ((timeNow - lastLineChangeTime) / 60000),
      );
      setLastLineChangeTime(timeNow);

      if (nextLineIndex === wordsArray.length) {
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
  }, [hitLeftCheckpoint, hitRightCheckpoint]);

  useEffect(() => {
    // Record the wpm every 2.5 seconds.
    const recordIntervalWpms = setInterval(() => {
      setIntervalWpms(intervalWpms ? [...intervalWpms, Math.floor(wpm)] : []);
    }, 2500);

    return () => clearInterval(recordIntervalWpms);
  }, [wpm, intervalWpms]);

  return (
    <AdaptiveModeTextDisplayInner
      wpm={wpm}
      currentLineIndex={currentLineIndex}
      nextLineIndex={nextLineIndex}
      wordsArray={wordsArray}
      fontSize={fontSize}
      updateLineContainerWidth={updateLineContainerWidth}
    />
  );
};

const AdaptiveModeTextDisplayInner = ({
  wpm,
  currentLineIndex,
  nextLineIndex,
  wordsArray,
  fontSize,
  updateLineContainerWidth,
}: {
  wpm: number;
  currentLineIndex: number;
  nextLineIndex: number;
  wordsArray: string[];
  fontSize: number;
  updateLineContainerWidth: (width: number) => void;
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const lineContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lineContainer.current) {
      updateLineContainerWidth(lineContainer.current.offsetWidth);
    }
  }, [lineContainer.current?.offsetWidth]);

  useEffect(() => {
    // Update the highlighted index every 60 / wpm seconds.
    const updateHighlightedIndex = setInterval(() => {
      // NOTE:
      // Take `prevHighlightedIndex` as an argument
      // to avoid capturing the stale value of `highlightedIndex` in the callback closure.
      setHighlightedIndex((prevHighlightedIndex) =>
        Math.min(prevHighlightedIndex + 1, nextLineIndex - 1),
      );
    }, 60000 / wpm);

    return () => clearInterval(updateHighlightedIndex);
  }, [wpm, nextLineIndex]);

  return (
    <Box>
      <Box
        ref={lineContainer}
        sx={{
          marginTop: "160px",
          width: "auto",
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
