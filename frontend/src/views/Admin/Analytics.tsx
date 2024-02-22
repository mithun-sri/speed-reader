import React, { useState } from "react";
import Header from "../../components/Header/Header";
import AdminAnalyticsTop from "../../components/Admin/AnalyticsTop";
import { Box } from "@mui/material";
import AnalyticsMode from "../../components/Admin/AnalyticsMode";
import AdminStatistics from "../../components/Admin/AdminStatistics";
import EnhancedTable from "../../components/Admin/AdminTextTable";

const AdminAnalytics: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState("mode");
  const [selectedOption, setSelectedOption] = useState("standard");

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleSelectChange = (newValue: string) => {
    setSelectedValue(newValue);
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
            width: "70vw",
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
            <>
              <AnalyticsMode
                selectedOption={selectedOption}
                handleOptionClick={handleOptionClick}
              />
              <AdminStatistics score={92} avgWpm={234} low={124} high={340} />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminAnalytics;
