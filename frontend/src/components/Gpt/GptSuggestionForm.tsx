import { Box } from "@mui/material";
import { AxiosResponse } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { QuestionCreate, TextCreateWithQuestions } from "../../api";
import { useApproveText, useGenerateText } from "../../hooks/admin";
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
const GptSuggestionForm: React.FC<{
  difficulty: string;
  isFiction: boolean;
}> = ({ difficulty, isFiction }) => {
  const { data: generatedText } = useGenerateText(difficulty, isFiction);
  console.log(generatedText);
  const useGptForm = useForm<GptFormData>();
  const { handleSubmit } = useGptForm;

  const approveText = useApproveText();

  const onSubmit: SubmitHandler<GptFormData> = async (data: GptFormData) => {
    // Build Question[] data to submit to server
    const questions: QuestionCreate[] = data.questions
      .filter((question) => question.selected)
      .map((question, _) => ({
        id: "", // will be generated by server
        content: question.content,
        options: question.options,
        correct_option: question.correctOption,
      }));
    // Build Text data to submit to server
    const text: TextCreateWithQuestions = {
      title: data.title,
      content: data.content,
      summary: data.summarised,
      source: generatedText.source,
      fiction: generatedText.fiction,
      difficulty: generatedText.difficulty,
      word_count: data.content.length,
      questions: questions,
    };
    // Send data to server
    approveText.mutate(text, {
      onSuccess: (res: AxiosResponse) => {
        console.log(res);
      },
      onError: (error: Error) => {
        console.log(error);
      },
    });
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
          sourceTitle={generatedText.title}
          author={""} // TODO
          link={generatedText.source}
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
          {/* <GptButton color={"#4285F4"} label={"generate 3 more questions"} /> */}
          <GptButton submit color={"#379F3B"} label={"approve"} />
        </Box>
      </form>
    </Box>
  );
};

export default GptSuggestionForm;
