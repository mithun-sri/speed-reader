import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const LinearProgressFallback = () => {
  return (
    <Box sx={{ width: "100%", color: "#E2B714" }}>
      <LinearProgress color="inherit" />
    </Box>
  );
};

export default LinearProgressFallback;
