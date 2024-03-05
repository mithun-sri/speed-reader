import { Box } from "@mui/material";
import React, { useEffect } from "react";
import JetBrainsMonoText from "../Text/TextComponent";

const Error = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box>
          <JetBrainsMonoText
            text={title}
            size={window.innerWidth / 10}
            color="#E2B714"
          ></JetBrainsMonoText>
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

export default Error;
