import {
  faArrowsToEye,
  faFileLines,
  faLock,
  faStopwatch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { useAuth } from "../../hooks/users";

const HeaderContainer = styled(Box)({
  backgroundColor: "#2C2E31",
  padding: "25px 25px 0px 25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  zIndex: 9999,
});

const Header = () => {
  const [iconSize, setIconSize] = useState(calculateIconSize());
  const { webGazerInitialised, setManualRecalibration } = useWebGazerContext();
  const { isAdmin } = useAuth();

  useEffect(() => {
    function handleResize() {
      setIconSize(calculateIconSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Run effect only once on mount

  function calculateIconSize() {
    // Adjust this logic based on your requirements
    const windowWidth = window.innerWidth;
    const minSize = 24;
    const maxSize = 72;

    // Calculate the size based on window dimensions or any other logic
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 15),
    );

    return calculatedSize;
  }
  return (
    <HeaderContainer>
      <Link to={"/"} style={{ textDecoration: "" }}>
        <IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                fontSize: iconSize,
                marginRight: "20px",
                marginLeft: "30px",
                color: "#D1D0C5",
              }}
            >
              <FontAwesomeIcon icon={faStopwatch} color="#E2B714" />
            </Box>
            <Box sx={{ color: "#D1D0C5" }}>
              <div
                style={{
                  textAlign: "left",
                  fontWeight: "bolder",
                  fontSize: iconSize / 2.4,
                  lineHeight: "1.5",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Speed <br />
                Reader
              </div>
            </Box>
          </Box>
        </IconButton>
      </Link>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {webGazerInitialised && (
          <IconButton
            style={{
              fontSize: iconSize / 1.8,
              marginRight: "20px",
            }}
            component={Link}
            onClick={() => {
              setManualRecalibration(true);
            }}
            to="/calibrate"
          >
            <FontAwesomeIcon icon={faArrowsToEye} color="#EE4B2B" />
          </IconButton>
        )}

        <Tooltip title="Available texts">
          <Link to={"/available-texts"}>
            <IconButton
              style={{
                fontSize: iconSize / 1.8,
                marginRight: "20px",
                marginLeft: "15px",
              }}
            >
              <FontAwesomeIcon icon={faFileLines} color="#D1D0C5" />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="User dashboard">
          <Link to={"/user"}>
            <IconButton
              style={{
                fontSize: iconSize / 1.8,
                marginRight: isAdmin ? "20px" : iconSize / 1.2,
                marginLeft: "15px",
                color: "#D1D0C5",
              }}
            >
              <FontAwesomeIcon icon={faUser} color="#E2B714" />
            </IconButton>
          </Link>
        </Tooltip>
        {isAdmin && (
          <Tooltip title="Admin dashboard">
            <IconButton
              style={{
                fontSize: iconSize / 1.8,
                marginRight: iconSize / 1.2,
                marginLeft: "15px",
                color: "#D1D0C5",
              }}
              component={Link}
              to="/admin"
            >
              <FontAwesomeIcon icon={faLock} color="#E2B714" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </HeaderContainer>
  );
};

export default Header;
