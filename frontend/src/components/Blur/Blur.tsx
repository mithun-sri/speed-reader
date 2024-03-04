import Box from "@mui/material/Box";
import JetBrainsMonoText from "../Text/TextComponent";

const BlurBox = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(30px)",
        zIndex: 5,
      }}
    >
      <JetBrainsMonoText text={"Game Paused"} size={25} color={"white"} />
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "light",
          fontSize: 18,
          color: "white",
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        Press &apos;Space&apos; key to unpause.
      </Box>
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "light",
          fontSize: 18,
          color: "white",
          position: "absolute",
          bottom: "200px",
        }}
      >
        Tip: Tap ↑ ↓ to control wpm.
      </Box>
    </Box>
  );
};

export default BlurBox;
