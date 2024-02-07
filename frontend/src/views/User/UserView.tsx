import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import UserDashboardTop from "../../components/User/UserDashboardTop";

const UserView = () => {
  const userId = "placeholder";
  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <UserDashboardTop user_id={userId} />
      </Box>
    </>
  );
};

export default UserView;
