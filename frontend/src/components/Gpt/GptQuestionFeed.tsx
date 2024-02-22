import { Box } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { Question } from "../../api";
import { useGptContext } from "../../context/GptContext";
import GptQuestion from "./GptQuestion";
import { GptFormData } from "./GptSuggestionForm";

const GptQuestionFeed: React.FC<{
  useFormReturn: UseFormReturn<GptFormData>;
}> = ({ useFormReturn }) => {
  const { textWithQuestions } = useGptContext();
  const _useFormReturn = useFormReturn; // temporary unused var

  const responseContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 4,
  };

  const questionSuggestions: Question[] = textWithQuestions.questions;

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
