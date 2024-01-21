import "@fontsource/jetbrains-mono";
import { faStopwatch, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

const HeaderContainer = styled(Box)({
  backgroundColor: "#2C2E31",
  padding: "25px 25px 0px 25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
});

const Header = () => {
  const [iconSize, setIconSize] = useState(calculateIconSize());

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
      Math.max(minSize, windowWidth / 15)
    );

    return calculatedSize;
  }
  return (
    <HeaderContainer>
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
      <IconButton
        style={{
          fontSize: iconSize / 1.8,
          marginRight: iconSize / 1.2,
          marginLeft: "30px",
          color: "#D1D0C5",
        }}
      >
        <FontAwesomeIcon icon={faUser} color="#E2B714" />
      </IconButton>
    </HeaderContainer>
  );
};

export default Header;
