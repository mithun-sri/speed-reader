import { Box } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { QuestionCreate, TextCreateWithQuestions } from "../../api";
import { GptFormData } from "../../views/Admin/GptView";
import GptQuestion from "./GptQuestion";

const GptQuestionFeed: React.FC<{
  useFormReturn: UseFormReturn<GptFormData>;
  generatedText: TextCreateWithQuestions;
}> = ({ useFormReturn, generatedText }) => {
  const responseContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 4,
  };

  const questionSuggestions: QuestionCreate[] = generatedText.questions;

  return (
    <Box sx={responseContainerStyles}>
      {questionSuggestions.map((question, index) => (
        <GptQuestion
          key={index}
          question={question}
          questionNum={index}
          useFormReturn={useFormReturn}
        />
      ))}
    </Box>
  );
};

export default GptQuestionFeed;
