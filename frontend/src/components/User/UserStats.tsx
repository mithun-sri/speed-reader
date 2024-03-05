import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { UserStatistics } from "../../api";

interface UserStatsProps {
  userData: UserStatistics;
}

const UserStats: React.FC<UserStatsProps> = ({ userData }) => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 35;
    const maxFontSize = 75;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 20));
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
    <Box
      sx={{
        alignItems: "center",
        flex: "1",
      }}
    >
      <UserData1
        title="score"
        value={userData.average_score}
        size={fontSize / 2.5}
      />
      <UserData1
        title="average wpm"
        value={userData.average_wpm}
        size={fontSize / 2.5}
      />
      <MinMax
        minVal={userData.min_wpm}
        maxVal={userData.max_wpm}
        size={fontSize / 2.5}
      />
    </Box>
  );
};

const UserData1: React.FC<{
  title: string;
  value: number;
  size: number;
}> = ({ title, value, size }) => {
  return (
    <Box sx={{ marginBottom: "10px" }}>
      <Box
        sx={{
          fontSize: size,
          color: "#FFFFFF",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          maxWidth: "200px",
        }}
      >
        {title}.
      </Box>
      <Box
        sx={{
          fontSize: size * 1.9,
          color: "#E2B714",
          fontFamily: "JetBrains Mono, monospace",
          fontWeight: "bolder",
          marginRight: "25px",
          alignSelf: "flex-end",
          textAlign: "right",
        }}
      >
        {title === "score"
          ? value === 0
            ? "n/a"
            : `${value}%`
          : value === 0
            ? "n/a"
            : `${value}`}
      </Box>
    </Box>
  );
};

const MinMax: React.FC<{
  minVal: number;
  maxVal: number;
  size: number;
}> = ({ minVal, maxVal, size }) => {
  const _Title: React.FC<{
    text: string;
  }> = ({ text }) => (
    <Box
      sx={{
        fontSize: size,
        color: "#FFFFFF",
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
      }}
    >
      {text}.
    </Box>
  );
  const _Value: React.FC<{
    val: number;
  }> = ({ val }) => (
    <Box
      sx={{
        fontSize: size * 1.6,
        color: "#E2B714",
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
      }}
    >
      {val !== 0 ? val : "-"}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ marginLeft: "10%" }}>
        <_Title text="min"></_Title>
        <_Value val={minVal}></_Value>
      </Box>
      <Box sx={{ marginRight: "10%" }}>
        <_Title text="max"></_Title>
        <_Value val={maxVal}></_Value>
      </Box>
    </Box>
  );
};

export default UserStats;
