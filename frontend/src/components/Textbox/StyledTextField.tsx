import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: 15,
    backgroundColor: "#2C2E31",
    color: "white",
    "&:hover": {
      "& fieldset": {
        borderColor: "#FFFFFF", // Change border color on hover
      },
    },
    "& input, & textarea": {
      padding: "3px",
      fontFamily: "JetBrains Mono, monospace",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E2B714", // Change border color on focus
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5F6368",
      borderWidth: "2px",
    },
  },
});

export default StyledTextField;
