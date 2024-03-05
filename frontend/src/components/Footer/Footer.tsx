import {
  faDiscord,
  faFacebook,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";

const Footer = () => {
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
    const minSize = 12;
    const maxSize = 36;

    // Calculate the size based on window dimensions or any other logic
    const calculatedSize = Math.min(
      maxSize,
      Math.max(minSize, windowWidth / 15),
    );

    return calculatedSize;
  }

  const iconButtonStyles = {
    fontSize: iconSize,
    marginLeft: "20px",
    marginRight: "20px",
    color: "#a3a296",
  };

  const linkButtonStyles = {
    color: "#a3a296",
    marginX: "20px",
    fontSize: "15px",
    "&:hover": {
      textDecoration: "underline",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "JetBrains Mono, monospace",
        color: "#a3a296",
        marginY: 5, // Add vertical margin
      }}
    >
      <Box>
        <IconButton
          href="https://www.termsandconditionsgenerator.com/live.php?token=gjeHytawZEgRtNIWQDZs8t42UopAzUfz"
          target="_blank"
          rel="noopener noreferrer"
          sx={linkButtonStyles}
        >
          Terms Of Condition
        </IconButton>
        <IconButton
          href="https://www.freeprivacypolicy.com/live/3ab76cb6-25b3-4e6c-978f-dee1539311ad"
          target="_blank"
          rel="noopener noreferrer"
          sx={linkButtonStyles}
        >
          Privacy Policy
        </IconButton>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton style={iconButtonStyles}>
            <FontAwesomeIcon icon={faFacebook} />
          </IconButton>
        </a>
        <a
          href="https://www.discord.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton style={iconButtonStyles}>
            <FontAwesomeIcon icon={faDiscord} />
          </IconButton>
        </a>
        <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
          <IconButton style={iconButtonStyles}>
            <FontAwesomeIcon icon={faXTwitter} />
          </IconButton>
        </a>
      </Box>
    </Box>
  );
};

export default Footer;
