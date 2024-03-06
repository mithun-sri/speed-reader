import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { TextCreateWithQuestions } from "../../api";
import JetBrainsMonoText from "../Text/TextComponent";
import StyledTextField from "../Textbox/StyledTextField";
import { GptFormData } from "./GptSuggestionForm";

const GptText: React.FC<{
  useFormReturn: UseFormReturn<GptFormData>;
  generatedText: TextCreateWithQuestions;
}> = ({ useFormReturn, generatedText }) => {
  const { register } = useFormReturn;

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginY: "50px",
  };

  const textFieldContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  };

  const textLabelStyles = {
    paddingLeft: "10px",
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Source URL"} size={25} color={"white"} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <StyledTextField
            sx={{ width: "100%" }}
            defaultValue={generatedText.source}
            {...register("source")}
          />
          <LinkButton link={generatedText.source} />
        </Box>
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Image URL"} size={25} color={"white"} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <StyledTextField
            sx={{ width: "100%" }}
            defaultValue={generatedText.image_url}
            {...register("image_url")}
          />
          <LinkButton link={generatedText.image_url} />
        </Box>
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Text Title"} size={25} color={"white"} />
        </Box>
        <StyledTextField
          defaultValue={generatedText.title}
          {...register("title")}
        />
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Text Content"} size={25} color={"white"} />
        </Box>
        <StyledTextField
          multiline
          rows={5}
          defaultValue={generatedText.content}
          {...register("content")}
        />
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText
            text={"Text Description"}
            size={25}
            color={"white"}
          />
        </Box>
        <StyledTextField
          multiline
          rows={3}
          defaultValue={generatedText.description}
          {...register("description")}
        />
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Text Summary"} size={25} color={"white"} />
        </Box>
        <StyledTextField
          multiline
          rows={3}
          defaultValue={generatedText.summary}
          {...register("summarised")}
        />
      </Box>
    </Box>
  );
};

const LinkButton: React.FC<{
  link: string;
}> = ({ link }) => {
  return (
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
  );
};

export default GptText;
