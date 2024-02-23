import { Box, MenuItem, SelectChangeEvent, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { TextWithQuestions } from "../../api";
import { StyledFormControl, StyledSelect } from "../Button/DropDownMenu";
import GptButton from "../Button/GptButton";
import { StyledCheckbox } from "../Checkbox/Checkbox";
import JetBrainsMonoText from "../Text/TextComponent";

const GptPrompt: React.FC<{
  onGenerateResponse: (response: TextWithQuestions) => void;
}> = ({ onGenerateResponse }) => {
  const [diff, setDiff] = useState<string>("easy");
  const [isFiction, setIsFiction] = useState(false);

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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSelectMode = (event: SelectChangeEvent<string>) => {
    setDiff(event.target.value as string);
  };

  const handleCheckFiction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFiction(event.target.checked);
  };

  const handleGenerateTextButton = async () => {
    // TODO: Make request through GPT endpoint

    try {
      // const response = await fetch(
      //   "http://localhost:8000/api/v1/admin/generate-text",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ difficulty: diff, is_fiction: isFiction }),
      //   },
      // );

      // if (!response.ok) {
      //   throw new Error("Failed to fetch data from /admin/generate-text");
      // }

      // TODO: replace dummy response with response from backend
      const response: TextWithQuestions = {
        id: "updated ID",
        title: "The Elements of Style",
        content:
          "Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts. This requires not that the writer make all his sentences short, or that he avoid all detail and treat his subjects only in outline, but that every word tell.",
        difficulty: "medium",
        word_count: 70,
        questions: [
          {
            id: "1",
            content: "What is the capital of France?",
            options: ["London", "Paris", "Berlin"],
            correct_option: 1,
          },
          {
            id: "2",
            content: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter"],
            correct_option: 1,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
          {
            id: "3",
            content: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2"],
            correct_option: 0,
          },
        ],
        summary: "summarised text here",
        source: "www.example.com",
        fiction: false,
      };

      // const data: TextWithQuestions = await response.json();
      const data: TextWithQuestions = response;
      console.log(data);
      onGenerateResponse(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <StyledBox sx={{ width: "100%", marginTop: "50px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <JetBrainsMonoText
              text="choose text difficulty."
              size={fontSize * 0.6}
              color="#FFFFFF"
            />
            <DropDownDiff
              selectValue={diff}
              selectOnChange={handleSelectMode}
            ></DropDownDiff>
          </Box>
          <Box
            sx={{
              display: "inherit",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <JetBrainsMonoText
              text="fiction?"
              size={fontSize * 0.6}
              color="#FFFFFF"
            />
            <StyledCheckbox checked={isFiction} onChange={handleCheckFiction} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <GptButton
            onButtonClick={handleGenerateTextButton}
            color="#E2B714"
            label="generate."
          ></GptButton>
        </Box>
      </StyledBox>
    </>
  );
};

const StyledBox = styled(Box)({
  backgroundColor: "#323437",
  borderRadius: "20px",
  margin: "5px auto",
  marginBottom: "30px",
  padding: "10px",
  border: "2px solid #646669",
  minHeight: "250px",
  boxSizing: "border-box",
});

const DropDownDiff: React.FC<{
  selectValue: string;
  selectOnChange: (event: SelectChangeEvent<string>) => void;
}> = ({ selectValue, selectOnChange }) => {
  return (
    <StyledFormControl>
      <StyledSelect
        value={selectValue}
        onChange={selectOnChange}
        sx={{ fontSize: "23px" }}
      >
        <MenuItem value="easy">easy</MenuItem>
        <MenuItem value="medium">medium</MenuItem>
        <MenuItem value="hard">hard</MenuItem>
      </StyledSelect>
    </StyledFormControl>
  );
};

export default GptPrompt;
