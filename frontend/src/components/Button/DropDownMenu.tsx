import { FormControl, InputLabel, Select, styled } from "@mui/material";

export const StyledFormControl = styled(FormControl)({
  margin: "10px",
  width: "200px",
});

export const StyledSelect = styled(Select<string>)({
  backgroundColor: "#646669",
  borderRadius: "30px",
  "& .MuiSelect-icon": {
    color: "#D1D0C5",
  },
  fontFamily: "JetBrains Mono, monospace",
  color: "white",
  fontWeight: "bolder",
  textAlign: "center",
});

export const StyledInputLabel = styled(InputLabel)({
  fontFamily: "JetBrains Mono, monospace",
  color: "#D1D0C5",
  fontStyle: "italic",
  fontWeight: "bolder",
  textAlign: "center",
});
