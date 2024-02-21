import { Box, IconButton } from "@mui/material";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import React from "react";

const SummarizedSubMode: React.FC = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          height: "65vh",
        }}
      >
        <Box
          sx={{
            fontSize: "2vw",
            fontWeight: "bolder",
            fontFamily: "JetBrains Mono, monospace",
            marginBottom: "3vw",
            color: "#D1D0C5",
          }}
        >
          choose submode.
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <IconButton
            sx={{
              fontWeight: "bolder",
              fontFamily: "JetBrains Mono, monospace",
              color: "#646669",
              fontSize: "3.6vw",
              padding: "0px 5vw",
              "&:hover": { color: "#E2B714" },
            }}
            disableFocusRipple
            disableRipple
          >
            <Box>
              Standard <br /> Mode
            </Box>
          </IconButton>
          <IconButton
            sx={{
              fontWeight: "bolder",
              fontFamily: "JetBrains Mono, monospace",
              color: "#646669",
              fontSize: "3.6vw",
              padding: "0px 5vw",
              "&:hover": { color: "#E2B714" },
            }}
            disableFocusRipple
            disableRipple
          >
            <Box>
              Adaptive <br /> Mode
            </Box>
          </IconButton>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default SummarizedSubMode;
