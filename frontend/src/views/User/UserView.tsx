import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import UserDashboardTop from "../../components/User/UserDashboardTop";

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
        <PageContainer>
          <StatisticsTitle fontSize={fontSize} />
        </PageContainer>
      </Box>
    </>
  );
};

const StatisticsTitle: React.FC<{
  fontSize: number;
}> = ({ fontSize }) => (
  <Box
    sx={{
      paddingBottom: "5px",
      fontSize: fontSize / 1.1,
      color: "#FFFFFF",
      fontFamily: "JetBrains Mono, monospace",
      margin: "20px",
      fontWeight: "bolder",
    }}
  >
    Statistics
  </Box>
);

const PageContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Box
    sx={{
      backgroundColor: "#323437",
      borderRadius: "50px",
      margin: "20px 100px",
      padding: "10px 100px",
    }}
  >
    {children}
  </Box>
);

export default UserView;
