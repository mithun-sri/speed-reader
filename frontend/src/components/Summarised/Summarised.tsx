import { Box } from "@mui/material";
import clickAudio from "../../common/audio";
import { useGameContext } from "../../context/GameContext";
import { useGameScreenContext } from "../../views/GameScreen/GameScreen";

const SummarisedSelect: React.FC<{
  size?: number;
}> = ({ size }) => {
  const { incrementCurrentStage } = useGameScreenContext();
  const { setSummarised, setDifficulty } = useGameContext();

  return (
    <Box
      onClick={() => {
        clickAudio.play();
        // set summarised (and set difficulty to null)
        setSummarised(true);
        setDifficulty(null);

        incrementCurrentStage();
      }}
      sx={{
        backgroundColor: "rgba(0,0,0,0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1.5,
        padding: "40px 50px",
      }}
    >
      <Box
        sx={{
          fontSize: (size || 20) / 4,
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          cursor: "pointer",
        }}
      >
        Summarised Text
      </Box>
      <Box
        sx={{
          fontSize: (size || 20) / 10,
          fontFamily: "JetBrains Mono, monospace",
          color: "#FFFFFF",
          width: "70%",
        }}
      >
        Explore some summarised non-fiction texts to enhance your reading
        comprehension.
      </Box>
    </Box>
  );
};

export default SummarisedSelect;
