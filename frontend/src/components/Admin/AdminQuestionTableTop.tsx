import { Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

interface AdminQuestionTableTopProps {
  text_title: string;
}

const AdminQuestionTableTop: React.FC<AdminQuestionTableTopProps> = ({
  text_title,
}) => {
  return (
    <>
      <Box sx={{ marginLeft: "8vw", marginTop: "1vh", marginBottom: "1.5vh" }}>
        <Link to="/admin">
          <IconButton>
            <Box
              sx={{
                fontFamily: "JetBrains Mono, monospace",
                color: "#D1D0C5",
                fontWeight: "bolder",
                fontSize: "1.5vw",
              }}
            >{`< back`}</Box>
          </IconButton>
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          fontFamily: "JetBrains Mono, monospace",
          color: "#fff",
          fontWeight: "bolder",
        }}
      >
        <Box
          sx={{
            fontSize: "2vw",
          }}
        >
          Questions for
        </Box>
        <Box sx={{ fontSize: "2.1vw", margin: "1vh 0" }}>{text_title}</Box>
      </Box>
    </>
  );
};

export default AdminQuestionTableTop;
