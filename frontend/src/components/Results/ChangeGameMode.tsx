import { Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

const ChangeGameMode: React.FC<{
  fontSize: number;
}> = ({ fontSize }) => {
  return (
    <IconButton sx={{ padding: 0, width: fontSize * 8 }}>
      <Link to="/" style={{ textDecoration: "none", color: "#E2B714" }}>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              marginLeft: fontSize / 8,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: "bold",
            }}
          >
            <Box fontSize={fontSize}>Change Game</Box>
            <Box fontSize={fontSize}>Mode</Box>
          </Box>
        </Box>
      </Link>
    </IconButton>
  );
};

export default ChangeGameMode;
