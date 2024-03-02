import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import UserGraph from "../../components/Graph/UserGraph";
import Header from "../../components/Header/Header";
import UserTable from "../../components/Table/UserTable";
import UserDashboardTop from "../../components/User/UserDashboardTop";
import UserStats from "../../components/User/UserStats";
import React from "react";
import {
  getCurrentUser,
  getHistories,
  getUserStatistics,
} from "../../hooks/users";

const UserView = () => {
  const { data: userData } = getCurrentUser();
  const userId = userData.username;

  const { data: userHistory } = getHistories();

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
    <Box sx={{ marginBottom: "40px" }}>
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
            <StatisticsBox />
          </Box>
        </PageContainer>
        <PageContainer size={fontSize} title="History">
          <Box>
            <UserTable results={userHistory} />
          </Box>
        </PageContainer>
      </Box>
    </Box>
  );
};

const StatisticsBox: React.FC = () => {
  const [mode, setMode] = useState("standard");
  const { data: newData } = getUserStatistics(mode);
  const userStatisticsData = newData;

  return (
    <>
      {userStatisticsData.average_wpm == 0 ? (
        <>
          <UserStats userData={userStatisticsData}></UserStats>
          <UserGraph mode={mode} setMode={setMode}></UserGraph>
        </>
      ) : (
        <Box
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#fff",
            fontSize: "1.4vw",
            margin: "5.4vw 26vw",
          }}
        >
          No Statistics Available.
        </Box>
      )}
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
      maxWidth: "1900px",
      margin: "0 0",
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
