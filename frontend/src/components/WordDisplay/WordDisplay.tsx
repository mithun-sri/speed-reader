import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const WordDisplay = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [fontSize, setFontSize] = useState(24);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#888",
          textAlign: "right",
        }}
      >
        <Typography variant="h4" color="text.secondary">
          {currentWord}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" color="text.primary" fontSize={fontSize}>
          {words.filter((word) => word.length <= 10).join(" ")}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#ddd",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" color="text.primary" fontSize={fontSize}>
          {words.filter((word) => word.length <= 10).join(" ")}
        </Typography>
      </Box>
    </Box>
  );
};

export default WordDisplay;
