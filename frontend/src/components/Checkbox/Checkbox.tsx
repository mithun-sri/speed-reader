import { Checkbox, styled } from "@mui/material";

export const StyledCheckbox = styled(Checkbox)({
  color: "#D9D9D9",
  "&.Mui-checked": {
    color: "#E2B714", // Color when checked
  },
  "& .MuiSvgIcon-root": {
    fontSize: 45,
  },
});
