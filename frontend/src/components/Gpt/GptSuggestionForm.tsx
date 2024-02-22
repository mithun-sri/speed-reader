import { Box } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useGptContext } from "../../context/GptContext";
import GptButton from "../Button/GptButton";
import GptQuestionFeed from "./GptQuestionFeed";
import GptSourceInfo from "./GptSourceInfo";
import GptText from "./GptText";

export interface GptFormData {
  title: string;
  content: string;
  summarised: string;
  questions: {
    content: string;
    options: string[];
    correctOption: number;
    selected: boolean;
  }[];
}

/**
 * SOURCE, AUTHOR LINK
 * TEXT TITLE, CONTENT, SUMMARY
 * SELECTED QUESTION COUNT
 * QUESTION LIST [DONE]
 * GENERATE 5 MORE QUESTIONS, APPROVE BUTTONS
 */
const GptSuggestionForm = () => {
  const { textWithQuestions } = useGptContext();
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
          sourceTitle={textWithQuestions.title}
          author={"William Strunk Jr."}
          link={"https://example.com"}
        />
        <GptText useFormReturn={useGptForm} />
        <GptQuestionFeed useFormReturn={useGptForm} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingY: "30px",
            gap: 5,
          }}
        >
          <GptButton color={"#4285F4"} label={"generate 3 more questions"} />
          <GptButton submit color={"#379F3B"} label={"approve"} />
        </Box>
      </form>
    </Box>
  );
};

export default GptSuggestionForm;
