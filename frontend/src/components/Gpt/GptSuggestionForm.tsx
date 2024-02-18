import { Box } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import GptQuestionFeed from "./GptQuestionFeed";
import GptSourceInfo from "./GptSourceInfo";
import GptText from "./GptText";

/** TODO: Change according the GPT response format
 *  source_title
    text_title
    content
    author
    difficulty
    fiction
    link
    source (how is this different from title?)
    questions
    description
    options
    description
    correct_option
    summary (if non-fiction)
 */
export interface GptFormData {
  suggestion1: string;
  suggestion2: string;
  suggestion3: string;
}

/**
 * SOURCE, AUTHOR LINK
 * TEXT TITLE, CONTENT, SUMMARY
 * SELECTED QUESTION COUNT
 * QUESTION LIST [DONE]
 * GENERATE 5 MORE QUESTIONS, APPROVE BUTTONS
 */
const GptSuggestionForm: React.FC<{
  response: string;
}> = ({ response }) => {
  const useGptForm = useForm<GptFormData>();
  const { handleSubmit } = useGptForm;

  const onSubmit: SubmitHandler<GptFormData> = (data) => {
    console.log(data);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GptSourceInfo
          sourceTitle={"dummy source"}
          author={"dummy author"}
          link={"https://example.com"}
        />
        <GptText useFormReturn={useGptForm} />
        <GptQuestionFeed useFormReturn={useGptForm} />
      </form>
    </Box>
  );
};

export default GptSuggestionForm;
