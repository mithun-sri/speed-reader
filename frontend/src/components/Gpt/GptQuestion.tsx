import { Box } from "@mui/material";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import JetBrainsMonoText from "../Text/TextComponent";
import StyledTextField from "../Textbox/StyledTextField";
import CheckboxGroup from "./CheckboxGroup";

const containerStyles = {
  width: "95%",
  backgroundColor: "#323437",
  borderRadius: "20px",
  boxSizing: "border-box",
  padding: "30px 50px", // Vertical, Horizontal
};

const GptQuestion = () => {
  const questionContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  };

  const answerContainerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 1,
    marginTop: "40px",
    width: "100%",
  };

  return (
    <Box sx={containerStyles}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <JetBrainsMonoText text={"Select Question"} size={20} color={"white"} />
        <StyledCheckbox />
      </Box>
      <Box sx={questionContainerStyles}>
        <Box sx={{ paddingLeft: "10px" }}>
          <JetBrainsMonoText text={"Question"} size={25} color={"white"} />
        </Box>
        <StyledTextField multiline sx={{ width: "100%" }} rows={3} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={answerContainerStyles}>
          <Box sx={{ paddingLeft: "10px" }}>
            <JetBrainsMonoText text={"Answers"} size={25} color={"white"} />
          </Box>
          <StyledTextField sx={{ width: "100%" }} />
          <StyledTextField sx={{ width: "100%" }} />
          <StyledTextField sx={{ width: "100%" }} />
        </Box>
        <CheckboxGroup defaultValue={1} />
      </Box>
    </Box>
  );
};

export default GptQuestion;
