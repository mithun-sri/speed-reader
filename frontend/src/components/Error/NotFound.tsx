import { Box } from "@mui/material";
import JetBrainsMonoText from "../Text/TextComponent";
import React, { useEffect } from "react";
import Header from "../Header/Header";

const NotFound = () => {
  const text = "The page you are looking for does not exist.";
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      <Box>
        <JetBrainsMonoText
          text="404"
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
    </Box>
  );
};

export default NotFound;
