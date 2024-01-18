import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Carousel = () => {
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSize, setFontSize] = useState(calculateFontSize());

  const boxStyle = {
    width: fontSize*1.3, // Set the desired fixed width for each mode box
    marginLeft: fontSize/20,
    marginRight: fontSize/20,
    color: "#646669",
    fontSize: fontSize/5
  };

  const centerBoxStyle = {
    width: fontSize*1.5,
    fontSize: fontSize/3,
    color: "#E2B714"
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
      Math.max(minFontSize, windowWidth / 6)
    );

    return calculatedFontSize;
  }

  return (
    <Box>
      <Box sx={{
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
        fontSize: fontSize/6
      }}>
        choose game mode.
      </Box>
      <Box sx={{ 
      display: "flex",
      fontFamily: "JetBrains Mono, monospace",
      alignItems: "center",
      flexDirection: "row",
      fontWeight: "bold",
      marginTop: fontSize/35,
      marginBottom: fontSize/50,
     }}>
        
        <Box sx={boxStyle}>
          Standard Mode
        </Box>
        <Box sx={centerBoxStyle}>
          Adaptive <br />Mode
        </Box>
        <Box sx={boxStyle}>
          Summarized Adaptive Mode
        </Box>
      </Box>
      <Box
      sx={{
        marginTop: fontSize/40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        fontFamily: 'JetBrainsMono, monospace',
        textAlign: 'center',
      }}
    >
      <Box sx={{ margin: `${fontSize / 8}px` }}>
        <FontAwesomeIcon fontSize={fontSize/2.3} icon={faCaretLeft} />
      </Box>
      <Box sx={{ margin: `${fontSize / 8}px` }}>
        <FontAwesomeIcon fontSize={fontSize/2.3} icon={faCaretRight} />
      </Box>
    </Box>
    </Box>
  );
};

export default Carousel;