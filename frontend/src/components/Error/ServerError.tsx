import { Box } from "@mui/material";
import JetBrainsMonoText from "../Text/TextComponent";
import React, { useEffect } from "react";
import Header from "../Header/Header";

const ServerError = () => {
  const text = "Oops, something went wrong on our end.";
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prev) =>
        prev + 1 >= text.split(" ").length ? text.split(" ").length : prev + 1,
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Header />
      <Box>
        <JetBrainsMonoText
          text="500"
          size={window.innerWidth / 10}
          color="#E2B714"
        ></JetBrainsMonoText>
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: "1em",
        }}
      >
        {text.split(" ").map((word, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              margin: "0.4em",
            }}
          >
            <JetBrainsMonoText
              text={word}
              size={window.innerWidth / 50}
              color={index <= highlightedIndex ? "#E2B714" : "#646669"}
            ></JetBrainsMonoText>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ServerError;
