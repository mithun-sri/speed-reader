import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { QuestionCreate, TextCreateWithQuestions } from "../../api";
import GptPrompt from "../../components/Gpt/GptPrompt";
import GptSuggestionForm, {
  GptFormData,
} from "../../components/Gpt/GptSuggestionForm";
import Header from "../../components/Header/Header";
import JetBrainsMonoText from "../../components/Text/TextComponent";
import { useSnack } from "../../context/SnackContext";
import { useApproveText, useGenerateText } from "../../hooks/admin";

const GptLoading = () => {
  const calculateFontSize = () => {
    const windowWidth = window.innerWidth;
    const minFontSize = 15;
    const maxFontSize = 45;

    return Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 35));
  };
  const [fontSize, setFontSize] = useState(calculateFontSize());
  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        color: "#E2B714",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginTop: "50px",
      }}
    >
      <CircularProgress
        color="inherit"
        size="100px"
        sx={{ marginBottom: "50px" }}
      />
      <JetBrainsMonoText
        text="Generating text. This may take a while..."
        size={fontSize * 0.6}
        color="#FFFFFF"
      />
    </Box>
  );
};

const GptForm = () => {
  const [generatedText, setGeneratedText] = useState<
    TextCreateWithQuestions | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const generateText = useGenerateText();

  const handleGenerateResponse = (difficulty: string, fiction: boolean) => {
    setLoading(true);
    generateText.mutate(
      { difficulty, isFiction: fiction },
      {
        onSuccess: (data) => {
          setGeneratedText(data);
        },
        onError: (error: Error) => {
          // @ts-expect-error "message" does not exist on "error" type
          showSnack("Failed to generate text: " + error.response.data.message);
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

  const approveText = useApproveText();
  const { showSnack } = useSnack();

  const handleApproveText = (data: GptFormData) => {
    // Build Question[] data to submit to server
    const questions: QuestionCreate[] = data.questions
      .filter((question) => question.selected)
      .map((question, _) => ({
        content: question.content,
        options: question.options,
        correct_option: question.correctOption,
      }));
    // Build Text data to submit to server
    const text: TextCreateWithQuestions = {
      title: generatedText!.title,
      content: data.content,
      summary: data.summarised,
      source: data.source,
      fiction: generatedText!.fiction,
      difficulty: generatedText!.difficulty,
      word_count: data.content.length,
      image_url: data.image_url,
      author: generatedText!.author,
      description: data.description,
      questions: questions,
    };

    if (questions.length < 10) {
      showSnack("Please select at least 10 questions!");
      return;
    }

    // Send data to server
    approveText.mutate(text, {
      onSuccess: () => {
        showSnack("Text approved successfully");
        setGeneratedText(undefined);
      },
      onError: (error: Error) => {
        // @ts-expect-error "message" does not exist on "error" type
        showSnack("Failed to approve text: " + error.response.data.message);
      },
    });
  };

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
  };

  const innerContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    minWidth: "450px",
    maxWidth: "1050px",
  };

  return (
    <>
      <Header />
      <Box sx={containerStyles}>
        <Box sx={innerContainerStyles}>
          <GptPrompt onGenerateResponse={handleGenerateResponse} />
          {loading && <GptLoading />}
          {generatedText && (
            <GptSuggestionForm
              generatedText={generatedText}
              onApproveText={handleApproveText}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
const GptView = () => {
  return <GptForm />;
};

export default GptView;
