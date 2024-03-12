import { Box, IconButton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../components/Error/NotFound";
import Header from "../../components/Header/Header";
import QuestionBox from "../../components/QuestionBox/QuestionBox";
import { getText } from "../../hooks/admin";

const AddQuestion = () => {
  const { text_id } = useParams();

  if (!text_id) {
    return <NotFound />;
  }

  const { data: textData } = getText(text_id);

  const innerContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1500px",
    color: "white",
    marginTop: "25px",
  };

  return (
    <Box>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{ marginLeft: "8vw", marginTop: "1vh", marginBottom: "1.5vh" }}
        >
          <Link to={`/admin/questions/${text_id}`}>
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
        <AdminQuestionTop text_title={textData.title} />
        <Box sx={innerContainerStyles}>
          <QuestionBox text_id={text_id} />
        </Box>
      </Box>
    </Box>
  );
};

const AdminQuestionTop: React.FC<{
  text_title: string;
}> = ({ text_title }) => {
  return (
    <>
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
          Add question for
        </Box>
        <Box
          sx={{ fontSize: "2.1vw", margin: "1vh 0", color: "#E2B714" }}
        >{`"${text_title}"`}</Box>
      </Box>
    </>
  );
};

export default AddQuestion;
