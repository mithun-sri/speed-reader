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
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <JetBrainsMonoText text={"Source:"} size={25} color={"#E2B714"} />
        <JetBrainsMonoText
          text={sourceTitle + ", " + author}
          size={25}
          color={"#FFFFFF"}
        />
        <IconButton
          component={Link}
          to={link}
          target="_blank"
          rel="noopener noreferrer" // To open in a new tab
          sx={{
            color: "#FFFFFF",
            "& :hover": {
              color: "#E2B714",
            },
            fontSize: "30px",
            width: "50px",
          }}
        >
          <FontAwesomeIcon
            icon={faSquareArrowUpRight}
            className="fa-table-page-icon"
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GptSourceInfo;
