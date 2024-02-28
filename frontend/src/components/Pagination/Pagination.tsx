import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";

const StyledPagination = styled(Pagination)({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "20px",
    paddingBottom: "20px",
    color: "primary",
    size: "large",
    "& .MuiPaginationItem-root": {
        color: "white",
        fontFamily: "JetBrains Mono, monospace",
    },
    "& .MuiPaginationItem-page.Mui-selected": {
        color: "black",
        backgroundColor: "#E2B714",
    },
    "&:hover .MuiPaginationItem-page.Mui-selected": {
        backgroundColor: "#BF9A0D",
    },
});

export default StyledPagination;