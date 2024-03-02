import { Box } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../Header/Header";
import JetBrainsMonoText from "../Text/TextComponent";

const NoMobile = () => {
  const title = "No Mobile";
  const description =
    "This application is not available on mobile devices. Please use a desktop or laptop to access this application.";

  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prev) =>
        prev + 1 >= description.split(" ").length
          ? description.split(" ").length
          : prev + 1,
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
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <JetBrainsMonoText text={title} size={36} color="#E2B714" />
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: "1em",
            marginLeft: "1em",
            marginRight: "1em",
          }}
        >
          {description.split(" ").map((word, index) => (
            <Box
              component="span"
              key={index}
              sx={{
                margin: "0.4em",
              }}
            >
              <JetBrainsMonoText
                text={word}
                size={16}
                color={index <= highlightedIndex ? "#E2B714" : "#646669"}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default NoMobile;
