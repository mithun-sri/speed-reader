import { Box } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { QuestionWithCorrectOption, Text } from "../../api";
import { useGenerateText } from "../../hooks/admin";
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

  const onSubmit: SubmitHandler<GptFormData> = (data: GptFormData) => {
    // Build Text data to submit to server
    const text: Text = {
      id: "", // TODO
      title: data.title,
      content: data.content,
      summary: data.summarised,
      source: generatedText.source,
      fiction: generatedText.fiction,
      difficulty: generatedText.difficulty,
      wordCount: data.content.length,
    };
    // Build QuestionWithCorrectOption[] data to submit to server
    const questions: QuestionWithCorrectOption[] = data.questions
      .filter((question) => question.selected)
      .map((question, index) => ({
        id: index.toString(), // TODO
        content: question.content,
        options: question.options,
        correctOption: question.correctOption,
      }));

    // TODO: send text and questions to server

    console.log(data);
    console.log(text);
    console.log(questions);
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
          author={generatedText.author}
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
