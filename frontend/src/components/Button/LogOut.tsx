import { Box, IconButton } from "@mui/material";
import { useLogout } from "../../hooks/users";

const LogOut: React.FC<{
  fontSize: number;
}> = ({ fontSize }) => {
  const logoutMutation = useLogout();

  const handleLogoutClick = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <IconButton onClick={handleLogoutClick}>
      <Box
        sx={{
          fontFamily: "JetBrains Mono, monospace",
          color: "#fff",
          backgroundColor: "#323437",
          fontWeight: "bolder",
          fontSize: fontSize,
          padding: "4px 8px",
          borderRadius: "20px",
        }}
      >
        Log Out
      </Box>
    </IconButton>
  );
};

export default LogOut;
