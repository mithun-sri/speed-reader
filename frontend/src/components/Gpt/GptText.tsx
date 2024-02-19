import { Box } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import JetBrainsMonoText from "../Text/TextComponent";
import StyledTextField from "../Textbox/StyledTextField";
import { GptFormData } from "./GptSuggestionForm";

const GptText: React.FC<{
  useFormReturn: UseFormReturn<GptFormData>;
}> = ({ useFormReturn }) => {
  const _useFormReturn = useFormReturn; // temporary unused var

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginY: "50px",
  };

  const textFieldContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  };

  const textLabelStyles = {
    paddingLeft: "10px",
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Text Title"} size={25} color={"white"} />
        </Box>
        <StyledTextField />
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Text Content"} size={25} color={"white"} />
        </Box>
        <StyledTextField multiline rows={5} />
      </Box>
      <Box sx={textFieldContainerStyles}>
        <Box sx={textLabelStyles}>
          <JetBrainsMonoText text={"Text Summary"} size={25} color={"white"} />
        </Box>
        <StyledTextField multiline rows={3} />
      </Box>
    </Box>
  );
};

export default GptText;
