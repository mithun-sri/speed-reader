import { Box } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { TextCreateWithQuestions } from "../../api";
import GptButton from "../Button/GptButton";
import GptQuestionFeed from "./GptQuestionFeed";
import GptSourceInfo from "./GptSourceInfo";
import GptText from "./GptText";

export interface GptFormData {
  title: string;
  author: string;
  content: string;
  summarised: string;
  questions: {
    content: string;
    options: string[];
    correctOption: number;
    selected: boolean;
  }[];
  source: string;
  image_url: string;
  description: string;
}

/**
 * SOURCE, AUTHOR LINK
 * TEXT TITLE, CONTENT, SUMMARY
 * SELECTED QUESTION COUNT
 * QUESTION LIST [DONE]
 * GENERATE 5 MORE QUESTIONS, APPROVE BUTTONS
 */
const GptSuggestionForm: React.FC<{
  generatedText: TextCreateWithQuestions;
  onApproveText: SubmitHandler<GptFormData>;
}> = ({ generatedText, onApproveText }) => {
  const useGptForm = useForm<GptFormData>();
  const { handleSubmit } = useGptForm;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit(onApproveText)}>
        <GptSourceInfo
          sourceTitle={generatedText.title}
          author={generatedText.author}
        />
        <GptText useFormReturn={useGptForm} generatedText={generatedText} />
        <GptQuestionFeed
          useFormReturn={useGptForm}
          generatedText={generatedText}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingY: "30px",
            gap: 5,
          }}
        >
          <GptButton submit color={"#379F3B"} label={"approve"} />
        </Box>
      </form>
    </Box>
  );
};

export default GptSuggestionForm;
