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
              onCountdownFinish={() => setShowGameScreen(true)}
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

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [hitLeftCheckpoint, setHitLeftCheckpoint] = useState(false);
  const [hitRightCheckpoint, setHitRightCheckpoint] = useState(false);
  const { setWebGazerListener, clearWebGazerListener } = useWebGazerContext();

  useEffect(() => {
    setWebGazerListener((data: any, _: any) => {
      if (data === null) return;
      const leftCheckpoint = 0.5;
      const rightCheckpoint = 0.75;
      if (!hitLeftCheckpoint && data.x < window.innerWidth * leftCheckpoint) {
        setHitLeftCheckpoint(true);
      }
      if (
        !hitRightCheckpoint &&
        hitLeftCheckpoint &&
        data.x > window.innerWidth * rightCheckpoint
      ) {
        setHitRightCheckpoint(true);
      }
    });

    return () => clearWebGazerListener();
  }, [hitLeftCheckpoint, hitRightCheckpoint]);

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
  const { intervalWpms, setIntervalWpms, setAverageWpm } = useGameContext();
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
      setIntervalWpms(intervalWpms ? [...intervalWpms, wpm] : []);
    }, 2500 * 10);

    return () => clearInterval(recordIntervalWpms);
  }, [wpm]);

  return (
    <AdaptiveModeTextDisplayInner
      wpm={wpm}
      currentLineIndex={currentLineIndex}
      nextLineIndex={nextLineIndex}
      wordsArray={wordsArray}
      fontSize={fontSize}
    />
  );
};

const AdaptiveModeTextDisplayInner = ({
  wpm,
  currentLineIndex,
  nextLineIndex,
  wordsArray,
  fontSize,
}: {
  wpm: number;
  currentLineIndex: number;
  nextLineIndex: number;
  wordsArray: string[];
  fontSize: number;
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

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
