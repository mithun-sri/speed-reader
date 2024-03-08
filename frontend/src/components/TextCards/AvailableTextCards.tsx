import {
  faGamepad,
  faSquareArrowUpRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "../../api";
import { useWebGazerContext } from "../../context/WebGazerContext";
import { TextFilter } from "../../hooks/users";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import DifficultyBox from "../Difficulty/DifficultyBox";
import FictionBox from "../Fiction/Fiction";
import JetBrainsMonoText from "../Text/TextComponent";
import StyledTextField from "../Textbox/StyledTextField";

export const SearchBar: React.FC<{
  initialFilters: TextFilter;
  onUpdateFilters: (textFilter: TextFilter) => void;
}> = ({ initialFilters, onUpdateFilters }) => {
  const difficulty_options = ["any", "easy", "medium", "hard"];

  const [formData, setFormData] = useState({
    keyword: initialFilters.keyword,
    only_unplayed: initialFilters.only_unplayed,
    include_fiction: initialFilters.include_fiction,
    include_nonfiction: initialFilters.include_nonfiction,
    difficulty:
      initialFilters.difficulty === "" ? "any" : initialFilters.difficulty,
  });

  const handleCheckOnlyUnplayed = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({ ...formData, only_unplayed: event.target.checked });
  };

  const handleCheckIncludeFiction = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({ ...formData, include_fiction: event.target.checked });
  };

  const handleCheckIncludeNonFiction = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({ ...formData, include_nonfiction: event.target.checked });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData({ ...formData, difficulty: event.target.value });
  };

  const handleUpdateFilters = () => {
    onUpdateFilters(formData);
  };

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
          value={formData.keyword}
          onChange={(e) =>
            setFormData({ ...formData, keyword: e.target.value })
          }
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
        <Box
          sx={{
            paddingLeft: "5px",
            paddingRight: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <JetBrainsMonoText
            text={"Only unplayed"}
            size={16}
            color={"#D9D9D9"}
          />
          <StyledCheckbox
            checked={!!formData.only_unplayed}
            onChange={handleCheckOnlyUnplayed}
          />
        </Box>
        <Box
          sx={{
            paddingLeft: "5px",
            paddingRight: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <JetBrainsMonoText text={"Fiction"} size={16} color={"#D9D9D9"} />
          <StyledCheckbox
            checked={!!formData.include_fiction}
            onChange={handleCheckIncludeFiction}
          />
        </Box>
        <Box
          sx={{
            paddingLeft: "5px",
            paddingRight: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <JetBrainsMonoText text={"Non-fiction"} size={16} color={"#D9D9D9"} />
          <StyledCheckbox
            checked={!!formData.include_nonfiction}
            onChange={handleCheckIncludeNonFiction}
          />
        </Box>
        <Box
          sx={{
            paddingLeft: "5px",
            paddingRight: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <JetBrainsMonoText text={"Difficulty"} size={16} color={"#D9D9D9"} />
          <Select
            value={formData.difficulty as string}
            label="Difficulty"
            onChange={handleSelectChange}
            sx={{
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
            }}
          >
            {difficulty_options.map((diff) => (
              <MenuItem key={diff} value={diff}>
                {diff}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export const ItemBoxHovered: React.FC<Text> = ({
  id,
  title,
  description,
  difficulty,
  fiction,
  source,
  author,
  image_base64,
  image_type,
}) => {
  const { setTextId_ } = useWebGazerContext();
  const navigate = useNavigate();

  const handleStandardClick = () => {
    console.log("selected text id is " + id);
    console.log("name is " + title);
    setTextId_(id);
    navigate("/game");
  };
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
          src={`data:${image_type};base64, ${image_base64}`}
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
              onClick={handleStandardClick}
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
                <Box>Play Text</Box>
                <FontAwesomeIcon
                  icon={faGamepad}
                  className="fa-table-page-icon"
                  style={{ marginLeft: "10px" }}
                />
              </Box>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ItemBox: React.FC<Text> = ({
  title,
  description,
  difficulty,
  image_base64,
  image_type,
  author,
  fiction,
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
        src={`data:${image_type};base64, ${image_base64}`}
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

export const NoTexts: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
      }}
    >
      <JetBrainsMonoText
        text={"No results found"}
        size={20}
        color={"#D9D9D9"}
      />
    </Box>
  );
};
