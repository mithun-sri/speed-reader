import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import clickAudio from "../../common/audio";

const Carousel: React.FC<{
  title?: string;
  options: string[];
  returnSelectedIndex: (value: number) => void;
  defaultIdx?: number;
}> = ({ title, options, returnSelectedIndex, defaultIdx }) => {
  const [currentIndex, setCurrentIndex] = useState(
    defaultIdx !== undefined ? defaultIdx : 1,
  );
  const [fontSize, setFontSize] = useState(calculateFontSize());

  const boxStyle = {
    width: fontSize * 1, // Set the desired fixed width for each mode box
    marginLeft: fontSize / 20,
    marginRight: fontSize / 20,
    color: "#646669",
    fontSize: fontSize / 6,
  };

  const centerBoxStyle = {
    width: fontSize * 1.8,
    fontSize: fontSize / 3.5,
    color: "#E2B714",
    marginLeft: fontSize / 10,
    marginRight: fontSize / 10,
  };

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Run effect only once on mount

  function calculateFontSize() {
    const windowWidth = window.innerWidth;
    const minFontSize = 40;
    const maxFontSize = 200;

    const calculatedFontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, windowWidth / 6),
    );

    return calculatedFontSize;
  }

  // to navigate through carousel options
  function handleLeftArrowClick() {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1,
    );
  }
  function handleRightArrowClick() {
    setCurrentIndex((prevIndex) =>
      prevIndex === options.length ? prevIndex : prevIndex + 1,
    );
  }
  const startIndex = currentIndex - 1;
  const endIndex = currentIndex + 1;
  const visibleOptions = [
    startIndex < 0 ? "" : options[startIndex],
    options[currentIndex],
    endIndex > options.length - 1 ? "" : options[endIndex],
  ];

  return (
    <Box>
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          paddingTop: "20px",
          fontSize: fontSize / 6.3,
          color: "#D1D0C5",
        }}
      >
        {title !== undefined ? title : "choose."}
      </Box>
      <Box
        sx={{
          display: "flex",
          fontFamily: "JetBrains Mono, monospace",
          alignItems: "center",
          flexDirection: "row",
          fontWeight: "bold",
          marginTop: fontSize / 35,
          marginBottom: fontSize / 50,
          height: fontSize,
        }}
      >
        {visibleOptions.map((option, index) => (
          <Box key={index} style={index === 1 ? centerBoxStyle : boxStyle}>
            {index === 1 ? (
              <Box
                onClick={() => {
                  clickAudio.play();
                  returnSelectedIndex(currentIndex); // Return index of selected carousel item
                }}
                sx={{
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {option}
              </Box>
            ) : (
              option
            )}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          marginTop: fontSize / 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          fontFamily: "JetBrainsMono, monospace",
          textAlign: "center",
        }}
      >
        <Box sx={{ margin: `${fontSize / 8}px` }}>
          <IconButton
            onClick={handleLeftArrowClick}
            disabled={currentIndex === 0}
            sx={{
              color: "#D9D9D9",
            }}
          >
            <FontAwesomeIcon fontSize={fontSize / 2.3} icon={faCaretLeft} />
          </IconButton>
        </Box>
        <Box sx={{ margin: `${fontSize / 8}px` }}>
          <IconButton
            onClick={handleRightArrowClick}
            disabled={currentIndex === options.length - 1}
            sx={{
              color: "#D9D9D9",
            }}
          >
            <FontAwesomeIcon fontSize={fontSize / 2.3} icon={faCaretRight} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Carousel;
