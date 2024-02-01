import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PATH_ADAPTIVE_MODE,
  PATH_STANDARD_MODE_1,
  PATH_STANDARD_MODE_2,
  PATH_SUMMARISED_ADAPTIVE_MODE,
} from "../../common/constants";

const Carousel = () => {
  // Note: these two arrays (options, paths) will be passed in as arguments to allow reusability
  const options = [
    "Standard Mode (Word)",
    "Standard Mode (Justified)",
    "Adaptive Mode",
    "Summarised Adaptive Mode",
  ];
  const paths = [
    PATH_STANDARD_MODE_1,
    PATH_STANDARD_MODE_2,
    PATH_ADAPTIVE_MODE,
    PATH_SUMMARISED_ADAPTIVE_MODE,
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <Box
      sx={{
        marginBottom: 10,
        marginTop: "32px",
      }}
    >
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          paddingTop: "20px",
          fontSize: fontSize / 6.3,
        }}
      >
        choose game mode.
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
              <Link
                to={paths[currentIndex]}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {option}
              </Link>
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
