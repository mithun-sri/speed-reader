import { Box } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminAnalyticsBox from "../../components/Admin/AdminAnalyticsBox";
import EnhancedTable from "../../components/Admin/AdminTextTable";
import AdminAnalyticsTop from "../../components/Admin/AnalyticsTop";
import Header from "../../components/Header/Header";
import { getAdminStatistics } from "../../hooks/admin";

const AdminAnalytics: React.FC = () => {
  const location = useLocation();
  const [selectedValue, setSelectedValue] = useState(
    location.state?.selectedValue || "text",
  );
  const [selectedOption, setSelectedOption] = useState("standard");

  const { data: adminStatistics } = getAdminStatistics(selectedOption);
  console.log(adminStatistics);
  const handleSelectChange = (newValue: string) => {
    setSelectedValue(newValue);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <AdminAnalyticsTop
          selectedValue={selectedValue}
          onSelectedValueChange={handleSelectChange}
        />
        <Box
          sx={{
            backgroundColor: "#323437",
            borderRadius: "50px",
            margin: "20px 50px",
            padding: "25px 100px",
            width: "80vw",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {selectedValue === "text" ? (
            <EnhancedTable />
          ) : (
            <AdminAnalyticsBox
              option={selectedOption}
              handleClick={handleOptionClick}
              score={adminStatistics.average_score}
              avgWpm={adminStatistics.average_wpm}
              min_wpm={adminStatistics.min_wpm}
              max_wpm={adminStatistics.max_wpm}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminAnalytics;
