import Box from "@mui/material/Box";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import GameProgressBar from "../../components/ProgressBar/GameProgressBar";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { useGameContext } from "../../context/GameContext";
import { WebGazerContext } from "../Calibration/WebGazerContext";

const TEXT =
  "The Software Engineering Group projects are on offer to Third Year Computing and JMC undergraduates as an optional Term 2 module (this may also be available as an option for external undergraduate exchange students). Students wishing to take the module must register for it and form a group before the project selection deadline. Dropping the module is not possible once groups have been formed and projects allocated (as that would not be fair on other students). We can't guarantee that every student will be able to find a suitable group. The aim of the Group Project is to try to simulate what working on a software development project in the professional world is like. Normally, professionals work in groups, have tight deadlines and have to be able to communicate and co-operate effectively with customers and other stakeholders. The performance of a group does not depend simply on the sum of the abilities of the individuals within it. Careful planning, frequent constructive meetings, goodwill and co-operation are needed to make a group successful. The expected workload is 250 hours per student. The Software Engineering Group Project is coordinated by Dr Thomas Lancaster. The software engineering teaching and assessment components are delivered by Dr Eoin Woods and Mr Matt Green. The project deliverables and the peer review process are administrated by David Loughlin. The Ed Board is used for general announcements and questions. Note that you will have to be subscribed to the Group Project on the module registration system at Level 2 or higher to access the Ed Board.";

const AdaptiveModeView = () => {
  const { wpm, setWpm } = useGameContext();

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
        <AdaptiveModeTextDisplay text={TEXT} wpm={wpm || 200} setWpm={setWpm} />
      </Box>
    </Box>
  );
};

const AdaptiveModeTextDisplay: React.FC<{
  text: string;
  wpm: number;
  setWpm: (wpm: number) => void;
  size?: number;
}> = ({ text, wpm, setWpm }) => {
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

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [nextLineIndex, setNextLineIndex] = useState(0);
  const [lastLineChangeTime, setLastLineChangeTime] = useState(Date.now());
  const wordsArray = text.split(" ");
  const maxCharactersPerLine = 60;
  const { x } = useContext(WebGazerContext);

  useEffect(() => {
    const checkNextLine = setInterval(() => {
      if (nextLineIndex == 0 || x > 100 || Math.random() < 0.05) {
        setNextLineIndex((prevNextLineIndex) => {
          const timeNow = Date.now();
          setWpm(
            (nextLineIndex - currentLineIndex) /
              ((timeNow - lastLineChangeTime) / 60000),
          );
          setLastLineChangeTime(timeNow);
          setHighlightedIndex(prevNextLineIndex);
          setCurrentLineIndex(prevNextLineIndex);
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
    }, 100);

    const updateHighlightedIndex = setInterval(() => {
      setHighlightedIndex((prevIndex) => {
        console.log(prevIndex);
        return prevIndex < nextLineIndex - 1
          ? prevIndex + 1
          : nextLineIndex - 1;
      });
    }, 60000 / wpm);

    return () => {
      clearInterval(checkNextLine);
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
