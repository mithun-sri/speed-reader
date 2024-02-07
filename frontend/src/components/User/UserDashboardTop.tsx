import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import LogOut from "../Button/LogOut";

const UserDashboardTop: React.FC<{
  user_id: string;
}> = ({ user_id }) => {
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          fontSize: fontSize,
          marginRight: "20px",
          marginLeft: "30px",
          color: "#D1D0C5",
        }}
      >
        <FontAwesomeIcon icon={faUser} color="#E2B714" />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
          marginLeft: 0,
        }}
      >
        <Box
          sx={{
            paddingTop: "10px",
            fontSize: fontSize / 1.7,
            color: "#D1D0C5",
            fontWeight: "bolder",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          User {user_id}
        </Box>
        <LogOut fontSize={fontSize / 4} />
      </Box>
    </Box>
  );
};

export default UserDashboardTop;
