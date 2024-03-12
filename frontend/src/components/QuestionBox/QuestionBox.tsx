import { Box, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { QuestionCreate } from "../../api";
import { useSnack } from "../../context/SnackContext";
import { useCreateQuestion } from "../../hooks/admin";
import JetBrainsMonoText from "../Text/TextComponent";
import StyledTextField from "../Textbox/StyledTextField";
import QuestionCheckbox from "./QuestionCheckbox";

export interface QuestionFormData {
  content: string;
  options: string[];
  correctOption: number;
}

const containerStyles = {
  backgroundColor: "#323437",
  borderRadius: "20px",
  boxSizing: "border-box",
  padding: "30px 50px", // Vertical, Horizontal
  justifyContent: "center",
  width: "80%",
};

const QuestionBox: React.FC<{ text_id: string }> = ({ text_id }) => {
  const questionForm = useForm<QuestionFormData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = questionForm;
  const createQuestion = useCreateQuestion(text_id);
  const { showSnack } = useSnack();
  const navigate = useNavigate();

  const questionContainerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 1,
    width: "100%",
  };

  const answerContainerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 1,
    marginTop: "40px",
    width: "100%",
  };

  const handleAddQuestion = (data: QuestionFormData) => {
    console.log(data);
    // Build QuestionCreate from QuestionFormData
    const question: QuestionCreate = {
      content: data.content,
      options: data.options,
      correct_option: data.correctOption,
    };

    // Send data to server
    createQuestion.mutate(question, {
      onSuccess: () => {
        showSnack("Question created successfully");
        navigate(`/admin/questions/${text_id}`);
      },
      onError: (error: Error) => {
        // @ts-expect-error "message" does not exist on "error" type
        showSnack("Failed to create question: " + error.response.data.message);
      },
    });
  };

  const EmptyFormMessage: React.FC<{ text: string }> = ({ text }) => (
    <Box
      sx={{
        color: "#E2B714",
        fontFamily: "JetBrains Mono, monospace",
        marginTop: "5px",
      }}
    >
      {text}
    </Box>
  );

  return (
    <Box sx={containerStyles}>
      <form onSubmit={handleSubmit(handleAddQuestion)}>
        <Box sx={questionContainerStyles}>
          <Box sx={{ paddingLeft: "10px" }}>
            <JetBrainsMonoText text={"Question"} size={25} color={"white"} />
          </Box>
          <StyledTextField
            multiline
            sx={{ width: "100%" }}
            rows={3}
            {...register("content", { required: true })}
          />
          {errors.content && (
            <EmptyFormMessage text={"Question cannot be empty"} />
          )}
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
            {Array.from({ length: 3 }, (_, index) => (
              <StyledTextField
                key={index}
                sx={{ width: "100%" }}
                {...register(`options.${index}`, { required: true })}
              />
            ))}
            {errors.options && (
              <EmptyFormMessage text={"Must have 3 options"} />
            )}
            {errors.correctOption && (
              <EmptyFormMessage text={"Select the correct option"} />
            )}
          </Box>
          <QuestionCheckbox useFormReturn={questionForm} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingY: "30px",
            gap: 5,
          }}
        >
          <IconButton
            type="submit"
            sx={{
              fontFamily: "JetBrains Mono, monospace",
              color: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                border: "7px solid #646669",
                borderRadius: "20px",
                padding: "7px 40px 7px 40px",
                fontWeight: "bolder",
                background: "#E2B714",
              }}
            >
              Add Question
            </Box>
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

export default QuestionBox;
