import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";

const CustomSelect: React.FC<{
  value: string;
  options: string[];
  label: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}> = ({ value, options, label, onChange }) => {
  return (
    <Select
      value={value}
      label={label}
      onChange={onChange}
      sx={{
        borderRadius: 5,
        border: "3px solid #D9D9D9",
        height: "39px",
        backgroundColor: "#2C2E31",
        color: "#D9D9D9",
        fontFamily: "JetBrains Mono, monospace",
        paddingLeft: "3px",
        paddingRight: "3px",
        marginLeft: "10px",
        marginRight: "10px",
        fontWeight: "bold",
        "&:hover": {
          borderColor: "#E2B714",
        },
        "&:hover .MuiSelect-icon": {
          color: "#E2B714",
        },
        ".MuiSelect-icon": {
          color: "#D9D9D9",
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
