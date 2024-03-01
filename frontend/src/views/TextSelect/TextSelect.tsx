import { Box } from "@mui/material";
import BackButton from "../../components/Button/BackButton";
import Header from "../../components/Header/Header";
import SummarisedSelect from "../../components/Summarised/Summarised";
import { useGameContext } from "../../context/GameContext";
import DiffSelect from "../DiffSelect/DiffSelect";
import { useGameScreenContext } from "../GameScreen/GameScreen";

const TextSelect = () => {
  const { decrementCurrentStage } = useGameScreenContext();
  const { setSummarised, setDifficulty } = useGameContext();

  const handleBackButton = () => {
    setSummarised(false);
    setDifficulty(null);
    decrementCurrentStage();
  };

  return (
    <Box>
      <Header />
      <Box sx={{ marginLeft: "7vw", marginTop: "35px", marginBottom: "0px" }}>
        <BackButton label="mode" handleClick={handleBackButton} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <TextSelectContainer>
          <SummarisedSelect />
        </TextSelectContainer>
        <HorizontalLineWithText />
        <TextSelectContainer>
          <DiffSelect />
        </TextSelectContainer>
      </Box>
    </Box>
  );
};

const TextSelectContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Box
    sx={{
      width: "80%",
      maxWidth: "900px",
    }}
  >
    <Box
      sx={{
        borderRadius: "40px",
        margin: "5px auto",
        marginBottom: "30px",
        padding: "40px 50px",
        border: "2px solid #646669",
        minHeight: "20px",
        boxSizing: "border-box",
        color: "#646669",
        "&:hover": {
          backgroundColor: "#303236",
          color: "#E2B714",
        },
      }}
    >
      {children}
    </Box>
  </Box>
);

const HorizontalLineWithText = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        gap: 3,
      }}
    >
      <Box
        sx={{
          height: "2px",
          width: "50%",
          backgroundColor: "#D1D0C5",
        }}
      />
      <Box
        sx={{
          fontSize: "3.5vw",
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          color: "#D1D0C5",
        }}
      >
        or
      </Box>
      <Box
        sx={{
          width: "50%",
          height: "2px",
          backgroundColor: "#D1D0C5",
        }}
      />
    </Box>
  );
};

export default TextSelect;
