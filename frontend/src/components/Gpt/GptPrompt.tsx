import { Box, MenuItem, SelectChangeEvent, styled } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import { StyledFormControl, StyledSelect } from "../Button/DropDownMenu";
import GptButton from "../Button/GptButton";
import JetBrainsMonoText from "../Text/TextComponent";

const GptPrompt = () => {
  const [diff, setDiff] = useState<string>("easy");
  const [fiction, setFiction] = useState(false);

  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 30;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 35));
  };
  const [fontSize, setFontSize] = useState(calculateFontSize());

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSelectMode = (event: SelectChangeEvent<string>) => {
    setDiff(event.target.value as string);
  };

  const handleCheckFiction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiction(event.target.checked);
  };

  const handleGenerateButton = () => {
    // TODO: Make request through GPT endpoint
    console.log("Button clicked!");
  };

  return (
    <>
      <StyledBox sx={{ width: "80%", maxWidth: "1050px", marginTop: "50px" }}>
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
            }}
          >
            <JetBrainsMonoText
              text="choose text difficulty."
              size={fontSize * 0.6}
              color="#FFFFFF"
            />
            <DropDownDiff
              selectValue={diff}
              selectOnChange={handleSelectMode}
            ></DropDownDiff>
          </Box>
          <Box
            sx={{
              display: "inherit",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <JetBrainsMonoText
              text="fiction?"
              size={fontSize * 0.6}
              color="#FFFFFF"
            />
            <StyledCheckbox checked={fiction} onChange={handleCheckFiction} />
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
            onButtonClick={handleGenerateButton}
            color="#E2B714"
            label="generate."
          ></GptButton>
        </Box>
      </StyledBox>
    </>
  );
};

const StyledCheckbox = styled(Checkbox)({
  color: "#D9D9D9",
  "&.Mui-checked": {
    color: "#E2B714", // Color when checked
  },
  "& .MuiSvgIcon-root": {
    fontSize: 45,
  },
});

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
  console.log("rendering dropdowndiff");
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
