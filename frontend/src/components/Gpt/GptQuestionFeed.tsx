import { Box } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import GptQuestion from "./GptQuestion";
import { GptFormData } from "./GptSuggestionForm";

const GptQuestionFeed: React.FC<{
  useFormReturn: UseFormReturn<GptFormData>;
}> = ({ useFormReturn }) => {
  const _useFormReturn = useFormReturn; // temporary unused var

  const responseContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 4,
  };

  return (
    <Box sx={responseContainerStyles}>
      <GptQuestion />
    </Box>
  );
};

export default GptQuestionFeed;
