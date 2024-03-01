import Box from "@mui/material/Box";
import JetBrainsMonoText from "../Text/TextComponent";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import { Link, MenuItem, OutlinedInput, Tooltip } from "@mui/material";
import StyledMultiSelect from "../MultiSelect/MultiSelect";
import IconButton from "@mui/material/IconButton";
import StyledTextField from "../Textbox/StyledTextField";
import DifficultyBox from "../Difficulty/DifficultyBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareArrowUpRight,
  faEye,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import FictionBox from "../Fiction/Fiction";
import { Text, UserAvailableTexts } from "../../api";

interface TextProps {
  title: string;
  description: string;
  difficulty: string;
  image?: string;
  author?: string;
  is_fiction?: boolean;
  source: string;
}

export const SearchBar: React.FC = () => {
  const difficulty = ["easy", "medium", "hard"];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "20vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        }}
      >
        <StyledTextField
          sx={{
            display: "flex",
            width: "80%",
          }}
          placeholder="Search for a text..."
        />
        <IconButton
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              border: "none",
              borderRadius: "5px",
              background: "#E2B714",
              padding: "15px 25px 15px 25px",
              fontWeight: "bolder",
              fontSize: "20px",
              wordWrap: "break-word",
              textAlign: "center",
              "&:hover": {
                backgroundColor: "#cba412",
              },
              transition: "0.1s ease-out",
            }}
          >
            <Box>Update Filters</Box>
          </Box>
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
        }}
      >
        <JetBrainsMonoText text={"Only unplayed"} size={16} color={"#D9D9D9"} />
        <StyledCheckbox />
        <JetBrainsMonoText text={"Fiction"} size={16} color={"#D9D9D9"} />
        <StyledCheckbox />
        <JetBrainsMonoText text={"Non-fiction"} size={16} color={"#D9D9D9"} />
        <StyledCheckbox />
        <JetBrainsMonoText text={"Difficulty"} size={16} color={"#D9D9D9"} />
        <StyledMultiSelect
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          input={<OutlinedInput label="Name" />}
          value={[difficulty[0]]}
        >
          {difficulty.map((diff) => (
            <MenuItem key={diff} value={diff}>
              {diff}
            </MenuItem>
          ))}
        </StyledMultiSelect>
        {/* Sort by */}
        <JetBrainsMonoText text={"Sort by"} size={16} color={"#D9D9D9"} />
        <StyledMultiSelect
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          input={<OutlinedInput label="Name" />}
          value={[difficulty[0]]}
        >
          {difficulty.map((diff) => (
            <MenuItem key={diff} value={diff}>
              {diff}
            </MenuItem>
          ))}
        </StyledMultiSelect>
        {/* Clear all filters */}
        {/* Update styling */}
      </Box>
    </Box>
  );
};

export const ItemBoxHovered: React.FC<Text> = ({title, description, difficulty, fiction, source, author, image_url}) => {

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
          width: "100%",
        }}
      >
        <Box
          component={"img"}
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "20%",
          }}
          src={image_url}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "85%",
            paddingTop: "1vh",
            paddingLeft: "2%",
            paddingRight: "2%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              overflowWrap: "break-word",
            }}
          >
            <JetBrainsMonoText text={title} size={24} color={"#D9D9D9"} />
            <Box
              sx={{
                display: "flex",
                width: "40%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <DifficultyBox difficulty={difficulty} />
              <FictionBox is_fiction={fiction} />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "20%",
                flexDirection: "row",
                marginLeft: "auto",
                justifyContent: "right",
              }}
            >
              <Link
                href={source}
                target="_blank"
                sx={{
                  textDecoration: "none",
                  marginLeft: "10px",
                  float: "right",
                  justifyContent: "right",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "right",
                  }}
                >
                  <Tooltip title="Learn more">
                    <IconButton
                      sx={{
                        color: "#FFFFFF",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faSquareArrowUpRight}
                        className="fa-table-page-icon"
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrowth: 1,
              marginBottom: "auto",
            }}
          >
            <Box
              sx={{
                marginBottom: "2vh",
              }}
            >
              <JetBrainsMonoText
                text={"By " + author}
                size={16}
                color={"#D9D9D9"}
              />
            </Box>
            <JetBrainsMonoText text={description} size={16} color={"#D9D9D9"} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
              alignItems: "center",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <IconButton
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                color: "#FFFFFF",
              }}
            >
              <Box
                sx={{
                  border: "none",
                  borderRadius: "5px",
                  background: "#E2B714",
                  padding: "10px 20px 10px 20px",
                  fontWeight: "bolder",
                  fontSize: "16px",
                  wordWrap: "break-word",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#cba412",
                  },
                  transition: "0.1s ease-out",
                }}
              >
                <FontAwesomeIcon
                  icon={faEye}
                  className="fa-table-page-icon"
                  style={{ marginRight: "10px" }}
                />
                <Box>Play Adaptive</Box>
              </Box>
            </IconButton>
            <IconButton
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                color: "#FFFFFF",
              }}
            >
              <Box
                sx={{
                  border: "none",
                  borderRadius: "5px",
                  background: "#E2B714",
                  padding: "10px 20px 10px 20px",
                  fontWeight: "bolder",
                  fontSize: "16px",
                  wordWrap: "break-word",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#cba412",
                  },
                  transition: "0.1s ease-out",
                }}
              >
                <FontAwesomeIcon
                  icon={faGamepad}
                  className="fa-table-page-icon"
                  style={{ marginRight: "10px" }}
                />
                <Box>Play Standard</Box>
              </Box>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ItemBox: React.FC<Text> = ({
  id,
  title,
  description,
  difficulty,
  image_url,
  author,
  fiction,
  source
}) => {

  const truncatedDescription =
    description.length > 200
      ? description.substring(0, 200) + "..."
      : description;
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        marginBottom: "20px",
        backgroundColor: "#323437",
      }}
    >
      <Box
        component={"img"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "15%",
        }}
        src={image_url}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "85%",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <JetBrainsMonoText text={title} size={24} color={"#D9D9D9"} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "40%",
              alignItems: "center",
            }}
          >
            <DifficultyBox difficulty={difficulty} />
            <FictionBox is_fiction={fiction} />
          </Box>
        </Box>
        <JetBrainsMonoText text={"By " + author} size={16} color={"#c7c7c7"} />
        <JetBrainsMonoText
          text={truncatedDescription}
          size={16}
          color={"#D9D9D9"}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "30%",
            }}
          ></Box>
          {/* <JetBrainsMonoText text={"Difficulty: " + difficulty} size={16} color={"#D9D9D9"} /> */}
        </Box>
      </Box>
    </Box>
  );
};
