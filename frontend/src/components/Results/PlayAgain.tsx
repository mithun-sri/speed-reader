import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@mui/material";

const PlayAgain: React.FC<{
  fontSize: number;
}> = ({ fontSize }) => {
  return (
    <IconButton sx={{ padding: 0, width: fontSize * 8 }}>
      <Box
        sx={{
          display: "flex",
          color: "#E2B714",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon fontSize={fontSize * 2.2} icon={faArrowRotateRight} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            marginLeft: fontSize / 8,
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: "bold",
          }}
        >
          <Box fontSize={fontSize}>Play</Box>
          <Box fontSize={fontSize}>Again</Box>
        </Box>
      </Box>
    </IconButton>
  );
};

export default PlayAgain;
