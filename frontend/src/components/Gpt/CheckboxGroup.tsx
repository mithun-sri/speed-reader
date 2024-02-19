import { Box, styled } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import React, { useState } from "react";

const CheckboxGroup: React.FC<{ defaultValue?: number }> = ({
  defaultValue,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    defaultValue !== undefined ? defaultValue.toString() : undefined,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

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
      <RadioGroup
        aria-label="options"
        name="options"
        value={selectedValue || ""}
        onChange={handleChange}
      >
        <FormControlLabel value="0" control={<StyledRadio />} label="" />
        <FormControlLabel value="1" control={<StyledRadio />} label="" />
        <FormControlLabel value="2" control={<StyledRadio />} label="" />
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

export default CheckboxGroup;
