import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const UserStats: React.FC<{}> = ({}) => {
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
        // width: "200px",
        // backgroundColor: "#FFFFFF",
        flex: "1",
      }}
    >
      <UserData1 title="score" value="84%" size={fontSize / 2} />
      <UserData1 title="average wpm" value="246" size={fontSize / 2.1} />
      <MinMax minVal="123" maxVal="534" size={fontSize / 3} />
    </Box>
  );
};

const UserData1: React.FC<{
  title: string;
  value: string;
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
        {value}
      </Box>
    </Box>
  );
};

const MinMax: React.FC<{
  minVal: string;
  maxVal: string;
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
    val: string;
  }> = ({ val }) => (
    <Box
      sx={{
        fontSize: size * 1.9,
        color: "#E2B714",
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: "bolder",
      }}
    >
      {val}
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
      <Box sx={{ margin: "5px" }}>
        <_Title text="min"></_Title>
        <_Value val={minVal}></_Value>
      </Box>
      <Box sx={{ margin: "5px" }}>
        <_Title text="max"></_Title>
        <_Value val={maxVal}></_Value>
      </Box>
    </Box>
  );
};

export default UserStats;