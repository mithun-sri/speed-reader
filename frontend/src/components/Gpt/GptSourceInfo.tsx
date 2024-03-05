import { Box } from "@mui/material";
import JetBrainsMonoText from "../Text/TextComponent";

const GptSourceInfo: React.FC<{
  sourceTitle: string;
  author: string;
}> = ({ sourceTitle, author }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <JetBrainsMonoText
          text={"Title, Author:"}
          size={25}
          color={"#E2B714"}
        />
        <JetBrainsMonoText
          text={sourceTitle + ", " + author}
          size={25}
          color={"#FFFFFF"}
        />
      </Box>
    </Box>
  );
};

export default GptSourceInfo;
