import Box from "@mui/material/Box";
import JetBrainsMonoText from "../Text/TextComponent";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import { FormControl, Link, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip } from "@mui/material";
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
import { Text, TextFilter, UserAvailableTexts } from "../../api";
import { useState } from "react";

export const SearchBar: React.FC<{ onUpdateFilters: (textFilter: TextFilter) => void }> = ({ onUpdateFilters }) => {
  const difficulty_options = ["any", "easy", "medium", "hard"];

  const [difficulty, setDifficulty] = useState<String>(difficulty_options[0])
  const [onlyUnplayed, setOnlyUnplayed] = useState(false);
  const [includeFiction, setIncludeFiction] = useState(false);
  const [includeNonFiction, setIncludeNonFiction] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleCheckOnlyUnplayed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnlyUnplayed(event.target.checked);
  };

  const handleCheckIncludeFiction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeFiction(event.target.checked);
  };

  const handleCheckIncludeNonFiction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeNonFiction(event.target.checked);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setDifficulty(newValue);
  };

  const handleUpdateFilters = () => {
    const filters = {
      include_fiction: includeFiction,
      include_nonfiction: includeNonFiction,
      difficulty: difficulty,
      only_unplayed: onlyUnplayed,
      keyword: keyword
    };
    onUpdateFilters(filters);
  }
  
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
          placeholder="Search for a text or author..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <IconButton
          sx={{
            fontFamily: "JetBrains Mono, monospace",
            color: "#FFFFFF",
          }}
          onMouseDown={handleUpdateFilters}
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
          <StyledCheckbox checked={onlyUnplayed} onChange={handleCheckOnlyUnplayed} />
          <JetBrainsMonoText text={"Fiction"} size={16} color={"#D9D9D9"} />
          <StyledCheckbox checked={includeFiction} onChange={handleCheckIncludeFiction} />
          <JetBrainsMonoText text={"Non-fiction"} size={16} color={"#D9D9D9"} />
          <StyledCheckbox checked={includeNonFiction} onChange={handleCheckIncludeNonFiction} />
          <JetBrainsMonoText text={"Difficulty"} size={16} color={"#D9D9D9"} />
          <Select
            value={difficulty as string}
            label="Difficulty"
            onChange={handleSelectChange}
            sx={
              {
                borderRadius: 5,
                border: "3px solid #D9D9D9",
                height: "39px",
                backgroundColor: "#2C2E31",
                color: "#D9D9D9",
                fontFamily: "JetBrains Mono, monospace",
                paddingLeft: "3px",
                paddingRight: "3px",
                marginLeft: "10px",
                marginRight: "10px",
                fontWeight: "bold",
                "&:hover": {
                  borderColor: "#E2B714",
                },
                "&:hover .MuiSelect-icon": {
                  color: "#E2B714",
                },
                ".MuiSelect-icon": {
                  color: "#D9D9D9",
                },
              }
            }
          >
            {difficulty_options.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {diff}
              </MenuItem>
            ))}
          </Select>
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
