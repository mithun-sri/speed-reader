import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";

const StyledMultiSelect = styled(Select)({
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
});

export default StyledMultiSelect;
