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
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControl component="fieldset">
        <Box
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#FFFFFF",
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
    </Box>
  );
};

const StyledRadio = styled(Radio)({
  color: "#FFFFFF",
  "&.Mui-checked": {
    color: "#E2B714",
  },
});

export default CheckboxGroup;
