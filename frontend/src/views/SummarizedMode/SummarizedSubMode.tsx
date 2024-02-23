import { Box, IconButton } from "@mui/material";
import Header from "../../components/Header/Header";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/Button/BackButton";

const SummarizedSubMode: React.FC = () => {
  // const { decrementCurrentStage } = useGameScreenContext();
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
    const minFontSize = 40;
    const maxFontSize = 200;

    const calculatedFontSize = Math.min(
      maxFontSize,
      Math.max(minFontSize, windowWidth / 6),
    );

    return calculatedFontSize;
  }

  // Need to add once GameContext issue fixed
  const handleBackButton = () => {};

  return (
    <>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px", marginBottom: "0px" }}>
        <BackButton label="mode" handleClick={handleBackButton} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bolder",
            paddingTop: "20px",
            fontSize: fontSize / 6.3,
            color: "#D1D0C5",
          }}
        >
          choose submode.
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
            height: "40vh",
          }}
        >
          <IconButton
            sx={{
              fontWeight: "bolder",
              fontFamily: "JetBrains Mono, monospace",
              color: "#646669",
              fontSize: "3.6vw",
              padding: "0px 5vw",
              "&:hover": { color: "#E2B714" },
            }}
            disableFocusRipple
            disableRipple
          >
            <Box>
              Standard <br /> Mode
            </Box>
          </IconButton>
          <IconButton
            sx={{
              fontWeight: "bolder",
              fontFamily: "JetBrains Mono, monospace",
              color: "#646669",
              fontSize: "3.6vw",
              padding: "0px 5vw",
              "&:hover": { color: "#E2B714" },
            }}
            disableFocusRipple
            disableRipple
          >
            <Box>
              Adaptive <br /> Mode
            </Box>
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default SummarizedSubMode;
