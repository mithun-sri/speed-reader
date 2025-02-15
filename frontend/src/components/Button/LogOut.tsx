import { Box, IconButton } from "@mui/material";

const LogOut: React.FC<{
  fontSize: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ fontSize, onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          color: "#fff",
          backgroundColor: "#323437",
          fontWeight: "bolder",
          fontSize: fontSize,
          padding: "4px 8px",
          borderRadius: "20px",
        }}
      >
        Log Out
      </Box>
    </IconButton>
  );
};

export default LogOut;
