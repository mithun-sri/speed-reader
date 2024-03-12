import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { useTextById } from "../../hooks/game";
import { useParams } from "react-router-dom";
import NotFound from "../../components/Error/NotFound";
import StyledTextField from "../../components/Textbox/StyledTextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "@mui/material/IconButton";


export interface QuestionFeedData {
  content: string;
  options: string[];
  correctOption: number;
  selected: boolean;
}

export interface GptFormData {
  title: string;
  author: string;
  content: string;
  summary: string;
  questions: QuestionFeedData[];
  source: string;
  image_url: string;
  description: string;
}

const textLabelStyles = {
  paddingLeft: "10px",
};

const TextLabel: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Box sx={textLabelStyles}>
      <JetBrainsMonoText text={text} size={25} color="white" />
    </Box>
  );
};

const TextForm = () => {
  const { text_id } = useParams();

  if (!text_id) {
    return <NotFound />;
  }

  const { data: text } = useTextById(text_id);


  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    width: "80vw",
    margin: "auto",
    marginTop: "30px",
  };

  const textFieldContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  };

  return (
    <Box>
      <Header />
      <Box sx={{ marginLeft: "8vw", marginTop: "1vh", marginBottom: "1.5vh" }}>
        <IconButton onClick={() => window.history.back()}>
          <Box
            sx={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#D1D0C5",
              fontWeight: "bolder",
              fontSize: "1.5vw",
            }}
          >{`< back`}</Box>
        </IconButton>
      </Box>
      <Box sx={containerStyles}>
        <Box sx={textFieldContainerStyles}>
          <TextLabel text={"Text Title"} />
          <StyledTextField
            defaultValue={text.title}
            // {...register("title")}
          />
        </Box>
        <Box sx={textFieldContainerStyles}>
          <TextLabel text={"Author"} />
          <StyledTextField defaultValue={text.author} />
        </Box>
        <Box sx={textFieldContainerStyles}>
          <TextLabel text={"Source URL"} />
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <StyledTextField
              sx={{ width: "100%" }}
              defaultValue={text.source}
            />
            {/* <LinkButton link={text.source} /> */}
          </Box>
        </Box>
        {/* <Box sx={textFieldContainerStyles}>
        <TextLabel text={"Image URL"} />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <StyledTextField
            sx={{ width: "100%" }}
            defaultValue={text.}
          />
          {/* <LinkButton link={generatedText.image_url} />
        </Box>
      </Box> */}
        <Box sx={textFieldContainerStyles}>
          <TextLabel text={"Text Content"} />
          <StyledTextField multiline rows={5} defaultValue={text.content} />
        </Box>
        <Box sx={textFieldContainerStyles}>
          <TextLabel text={"Text Description"} />
          <StyledTextField multiline rows={3} defaultValue={text.description} />
        </Box>
        <Box sx={textFieldContainerStyles}>
          <TextLabel text={"Text Summary"} />
          <StyledTextField multiline rows={3} defaultValue={text.summary} />
        </Box>
        <Box sx={textFieldContainerStyles}>
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
                fontSize: "18px",
                wordWrap: "break-word",
                textAlign: "center",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "#cba412",
                },
                transition: "0.1s ease-out",
                marginBottom: "20px",
              }}
            >
              <Box>Update text</Box>
              <FontAwesomeIcon
                icon={"pencil"}
                className="fa-table-page-icon"
                style={{ marginLeft: "10px" }}
              />
            </Box>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TextForm;
