import { Box } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { Question } from "../../api";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import JetBrainsMonoText from "../Text/TextComponent";
import StyledTextField from "../Textbox/StyledTextField";
import CheckboxGroup from "./CheckboxGroup";
import { GptFormData } from "./GptSuggestionForm";

const containerStyles = {
  width: "100%",
  backgroundColor: "#323437",
  borderRadius: "20px",
  boxSizing: "border-box",
  padding: "30px 50px", // Vertical, Horizontal
};

const GptQuestion: React.FC<{
  question: Question;
  questionNum: number;
  useFormReturn: UseFormReturn<GptFormData>;
}> = ({ question, questionNum, useFormReturn }) => {
  const { register } = useFormReturn;

  const questionContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  };

  const answerContainerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 1,
    marginTop: "40px",
    width: "100%",
  };

  return (
    <Box sx={containerStyles}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <JetBrainsMonoText text={"Select Question"} size={20} color={"white"} />
        <StyledCheckbox {...register(`questions.${questionNum}.selected`)} />
      </Box>
      <Box sx={questionContainerStyles}>
        <Box sx={{ paddingLeft: "10px" }}>
          <JetBrainsMonoText text={"Question"} size={25} color={"white"} />
        </Box>
        <StyledTextField
          multiline
          sx={{ width: "100%" }}
          rows={3}
          defaultValue={question.content}
          {...register(`questions.${questionNum}.content`)}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={answerContainerStyles}>
          <Box sx={{ paddingLeft: "10px" }}>
            <JetBrainsMonoText text={"Answers"} size={25} color={"white"} />
          </Box>
          {question.options.map((option, index) => (
            <StyledTextField
              key={index}
              sx={{ width: "100%" }}
              defaultValue={option}
              {...register(`questions.${questionNum}.options.${index}`)}
            />
          ))}
        </Box>
        <CheckboxGroup
          defaultValue={question.correctOption}
          questionNum={questionNum}
          useFormReturn={useFormReturn}
        />
      </Box>
    </Box>
  );
};

export default GptQuestion;
