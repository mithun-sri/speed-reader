import { Box } from "@mui/material";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { TextCreateWithQuestions } from "../../api";
import { GptFormData } from "../../views/Admin/GptView";
import GptButton from "../Button/GptButton";
import GptQuestionFeed from "./GptQuestionFeed";
import GptText from "./GptText";

/**
 * SOURCE, AUTHOR LINK
 * TEXT TITLE, CONTENT, SUMMARY
 * SELECTED QUESTION COUNT
 * QUESTION LIST [DONE]
 * GENERATE 5 MORE QUESTIONS, APPROVE BUTTONS
 */
const GptSuggestionForm: React.FC<{
  useFormReturn: UseFormReturn<GptFormData>;
  generatedText: TextCreateWithQuestions;
  onApproveText: SubmitHandler<GptFormData>;
}> = ({ useFormReturn, generatedText, onApproveText }) => {
  const { handleSubmit } = useFormReturn;

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
        <GptText useFormReturn={useFormReturn} generatedText={generatedText} />
        <GptQuestionFeed
          useFormReturn={useFormReturn}
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
