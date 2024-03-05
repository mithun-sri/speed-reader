import { Box } from "@mui/material";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const PolicyTemplate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          flex: 1,
          color: "#D1D0C5",
          fontFamily: "JetBrains Mono, monospace",
          width: "90%",
          maxWidth: "1600px",
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default PolicyTemplate;
