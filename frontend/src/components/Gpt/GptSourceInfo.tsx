import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import JetBrainsMonoText from "../Text/TextComponent";

const GptSourceInfo: React.FC<{
  sourceTitle: string;
  author: string;
  link: string;
}> = ({ sourceTitle, author, link }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <JetBrainsMonoText text={"Source:"} size={25} color={"#E2B714"} />
        <JetBrainsMonoText text={sourceTitle} size={25} color={"#FFFFFF"} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <JetBrainsMonoText text={"Author:"} size={25} color={"#E2B714"} />
        <JetBrainsMonoText text={author} size={25} color={"#FFFFFF"} />
      </Box>

      <IconButton
        component={Link}
        to={link}
        sx={{
          color: "#FFFFFF",
          "& :hover": {
            color: "#E2B714",
          },
          fontSize: "40px",
          width: "50px",
        }}
      >
        <FontAwesomeIcon
          icon={faSquareArrowUpRight}
          className="fa-table-page-icon"
        />
      </IconButton>
    </Box>
  );
};

export default GptSourceInfo;
