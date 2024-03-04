import { FormControl, InputLabel, Select, TablePagination, styled } from "@mui/material";

export const StyledFormControl = styled(FormControl)({
  margin: "10px",
  width: "13vw",
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
  fontSize: "1vw",
  textAlign: "center",
  padding: "0",
});

export const StyledInputLabel = styled(InputLabel)({
  fontFamily: "JetBrains Mono, monospace",
  color: "#D1D0C5",
  paddingLeft: "10px",
  // fontStyle: "italic",
  fontWeight: "bolder",
  textAlign: "center",
});

export const StyledTablePagination = styled(TablePagination)({
  display: "flex",
  justifyContent: "flex-end", /* Align toolbar to the right */
  borderColor: "#646669",
  fontFamily: "JetBrains Mono, monospace",

  ".MuiTablePagination-toolbar": {
    backgroundColor: "#323437", /* Background color */
    color: "white", /* Text color */
  },

  ".MuiSelect-icon": {
    color: "white", /* Drop down Arrow color */
  },

  ".MuiTablePagination-input, .MuiTablePagination-displayedRows": {
    color: "white", /* Text colour */
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "0.9vw",
  },

  /* 'Rows per page' text */
  ".MuiTablePagination-selectLabel": {
    fontSize: "0.9vw",
    fontFamily: "JetBrains Mono, monospace",
  },
});