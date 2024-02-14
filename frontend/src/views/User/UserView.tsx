import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import UserGraph from "../../components/Graph/UserGraph";
import Header from "../../components/Header/Header";
import UserTable from "../../components/Table/UserTable";
import UserDashboardTop from "../../components/User/UserDashboardTop";
import UserStats from "../../components/User/UserStats";

const UserView = () => {
  const userId = "placeholder";

  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 35));
  };
  const [fontSize, setFontSize] = useState(calculateFontSize());

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <UserDashboardTop user_id={userId} />
        <PageContainer size={fontSize} title="Statistics">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <UserStats></UserStats>
            <UserGraph></UserGraph>
          </Box>
        </PageContainer>
        <PageContainer size={fontSize} title="History">
          <Box>
            <UserTable />
          </Box>
        </PageContainer>
      </Box>
      <Footer />
    </>
  );
};

const Title: React.FC<{
  fontSize: number;
  text: string;
}> = ({ fontSize, text }) => (
  <Box
    sx={{
      fontSize: fontSize * 0.9,
      color: "#FFFFFF",
      fontFamily: "JetBrains Mono, monospace",
      marginLeft: "50px",
      fontWeight: "bolder",
    }}
  >
    {text}
  </Box>
);

const PageContainer: React.FC<{
  title?: string;
  size: number;
  children: React.ReactNode;
}> = ({ title, size, children }) => (
  <Box
    sx={{
      width: "80%",
      maxWidth: "1050px",
      margin: "0 auto",
      marginTop: size / 15,
    }}
  >
    <Title fontSize={size} text={title === undefined ? "" : title} />
    <Box
      sx={{
        backgroundColor: "#323437",
        borderRadius: "50px",
        margin: "5px auto",
        marginBottom: "30px",
        padding: "40px 50px",
        border: "2px solid #646669",
        minHeight: "250px",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  </Box>
);

export default UserView;
