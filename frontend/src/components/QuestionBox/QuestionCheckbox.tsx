import { Box, styled } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { QuestionFormData } from "./QuestionBox";

const QuestionCheckbox: React.FC<{
  useFormReturn: UseFormReturn<QuestionFormData>;
}> = ({ useFormReturn }) => {
  const { register } = useFormReturn;

  return (
    <FormControl
      component="fieldset"
      sx={{ display: "flex", alignItems: "center" }}
    >
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          color: "#FFFFFF",
          fontSize: "20px",
          fontWeight: "bolder",
          marginBottom: "20px",
        }}
      >
        Correct?
      </Box>
      <RadioGroup aria-label="options" name="options">
        <FormControlLabel
          value={0}
          control={<StyledRadio />}
          label=""
          {...register(`correctOption` as const, { required: true })}
        />
        <FormControlLabel
          value={1}
          control={<StyledRadio />}
          label=""
          {...register(`correctOption` as const, { required: true })}
        />
        <FormControlLabel
          value={2}
          control={<StyledRadio />}
          label=""
          {...register(`correctOption` as const, { required: true })}
        />
      </RadioGroup>
    </FormControl>
  );
};

const StyledRadio = styled(Radio)({
  marginLeft: "20px",
  marginBottom: "25px",
  color: "#FFFFFF",
  "&.Mui-checked": {
    color: "#E2B714",
  },
});

export default QuestionCheckbox;
