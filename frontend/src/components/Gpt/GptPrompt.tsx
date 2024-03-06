import { Box, MenuItem, SelectChangeEvent, styled } from "@mui/material";
import { useState } from "react";
import { StyledFormControl, StyledSelect } from "../Button/DropDownMenu";
import GptButton from "../Button/GptButton";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import CustomSelect from "../Select/CustomSelect";
import JetBrainsMonoText from "../Text/TextComponent";

const GptPrompt: React.FC<{
  onGenerateResponse: (difficulty: string, isFiction: boolean) => void;
}> = ({ onGenerateResponse }) => {
  const [diff, setDiff] = useState<string>("easy");
  const [isFiction, setIsFiction] = useState(false);

  const handleSelectMode = (event: SelectChangeEvent<string>) => {
    setDiff(event.target.value as string);
  };

  const handleCheckFiction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFiction(event.target.checked);
  };

  const handleGenerateTextButton = () => {
    onGenerateResponse(diff, isFiction);
  };

  const difficulty_options = ["any", "easy", "medium", "hard"];
  return (
    <>
      <StyledBox sx={{ width: "100%", marginTop: "50px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "30px",
              gap: 1.5,
            }}
          >
            <JetBrainsMonoText
              text="Choose text difficulty"
              size={20}
              color="#FFFFFF"
            />
            <CustomSelect
              value={diff}
              label="Difficulty"
              onChange={handleSelectMode}
              options={difficulty_options}
            />
          </Box>
          <Box
            sx={{
              display: "inherit",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <JetBrainsMonoText text="fiction?" size={20} color="#FFFFFF" />
            <StyledCheckbox checked={isFiction} onChange={handleCheckFiction} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <GptButton
            onButtonClick={handleGenerateTextButton}
            color="#E2B714"
            label="Generate"
          ></GptButton>
        </Box>
      </StyledBox>
    </>
  );
};

const StyledBox = styled(Box)({
  backgroundColor: "#323437",
  borderRadius: "20px",
  margin: "5px auto",
  marginBottom: "30px",
  padding: "10px",
  border: "2px solid #646669",
  minHeight: "250px",
  boxSizing: "border-box",
});

const DropDownDiff: React.FC<{
  selectValue: string;
  selectOnChange: (event: SelectChangeEvent<string>) => void;
}> = ({ selectValue, selectOnChange }) => {
  return (
    <StyledFormControl>
      <StyledSelect
        value={selectValue}
        onChange={selectOnChange}
        sx={{ fontSize: "23px" }}
      >
        <MenuItem value="easy">easy</MenuItem>
        <MenuItem value="medium">medium</MenuItem>
        <MenuItem value="hard">hard</MenuItem>
      </StyledSelect>
    </StyledFormControl>
  );
};

export default GptPrompt;
