import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { calculateAverageWpm } from "../../common/constants";
import Header from "../../components/Header/Header";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { useGameContext } from "../../context/GameContext";
import { useNextText } from "../../hooks/game";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const AdaptiveModeView = () => {
  // When GPT get next text is set up use the following instead
  //const { wpm, setTextId, summarised } = useGameContext();
  //const { data: text } = summarised ? useNextSummarisedText() : useNextText();
  const { wpm, setTextId } = useGameContext();
  const { data: text } = useNextText();

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
        <AdaptiveModeTextDisplay text={text.content} wpm={wpm || 200} />
      </Box>
    </Box>
  );
};

const AdaptiveModeTextDisplay: React.FC<{
  text: string;
  wpm: number;
  size?: number;
}> = ({ text, wpm }) => {
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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [nextLineIndex, setNextLineIndex] = useState(0);
  const [lastLineChangeTime, setLastLineChangeTime] = useState(Date.now());
  const [hitLeftCheckpoint, setHitLeftCheckpoint] = useState(false);
  const { setWpm, gazeX, intervalWpms, setIntervalWpms, setAverageWpm } =
    useGameContext();
  const { incrementCurrentStage } = useGameScreenContext();

  useEffect(() => {
    if (highlightedIndex === wordsArray.length - 1 && wordsArray.length > 0) {
      const avg_wpm = calculateAverageWpm(intervalWpms);
      setAverageWpm(avg_wpm);

      incrementCurrentStage();
      console.log("intervalWpms: ");
      console.log(intervalWpms);
    }
  }, [highlightedIndex, wordsArray.length]);

  // record WPM every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIntervalWpms([...intervalWpms, wpm]);
    }, 2500);

    return () => clearInterval(interval);
  }, [wpm, intervalWpms]);

  useEffect(() => {
    if (
      nextLineIndex == 0 ||
      (hitLeftCheckpoint && gazeX > window.innerWidth * rightCheckpoint)
    ) {
      setNextLineIndex((prevNextLineIndex) => {
        const timeNow = Date.now();
        setWpm(
          (nextLineIndex - currentLineIndex) /
            ((timeNow - lastLineChangeTime) / 60000),
        );
        setLastLineChangeTime(timeNow);
        setHighlightedIndex(prevNextLineIndex);
        setCurrentLineIndex(prevNextLineIndex);
        setHitLeftCheckpoint(false);
        let lineLength = wordsArray[prevNextLineIndex].length;

        for (let i = prevNextLineIndex + 1; i < wordsArray.length; i++) {
          lineLength += wordsArray[i].length + 1;

          if (lineLength > maxCharactersPerLine) {
            return i - 1;
          }
        }

        return prevNextLineIndex;
      });
    }

    if (!hitLeftCheckpoint) {
      setHitLeftCheckpoint(gazeX < window.innerWidth * leftCheckpoint);
    }
  }, [gazeX]);

  useEffect(() => {
    const updateHighlightedIndex = setInterval(() => {
      setHighlightedIndex((prevIndex) => {
        return prevIndex < nextLineIndex - 1
          ? prevIndex + 1
          : nextLineIndex - 1;
      });
    }, 60000 / wpm);

    return () => {
      clearInterval(updateHighlightedIndex);
    };
  }, [text, wpm]);

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
