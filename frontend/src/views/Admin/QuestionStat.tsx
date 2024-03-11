import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import AdminQuestionTable from "../../components/Admin/AdminQuestionTable";
import AdminQuestionTableTop from "../../components/Admin/AdminQuestionTableTop";
import NotFound from "../../components/Error/NotFound";
import Header from "../../components/Header/Header";
import { getQuestions, getText } from "../../hooks/admin";

const AdminQuestionStat = () => {
  const { text_id } = useParams();

  if (!text_id) {
    return <NotFound />;
  }

  const { data: questionStats } = getQuestions(text_id);
  const { data: textData } = getText(text_id);

  return (
    <>
      <Header />
      <AdminQuestionTableTop text_title={textData.title} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#323437",
          margin: "1vh 12vw",
          padding: "2vh",
          borderRadius: "30px",
        }}
      >
        <AdminQuestionTable text_id={text_id} data={questionStats} />
      </Box>
    </>
  );
};

export default AdminQuestionStat;
