import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Snackbar } from "@mui/material";
import { ReactNode, createContext, useContext, useState } from "react";

interface SnackContextType {
  showSnack: (message: string) => void;
}

const SnackContext = createContext<SnackContextType>({
  showSnack: () => {},
});

export function useSnack() {
  const context = useContext(SnackContext);
  if (!context) {
    throw new Error(
      "useSnackContext must be used within a SnackContextProvider",
    );
  }
  return context;
}

export function SnackContextProvider({ children }: { children: ReactNode }) {
  const showSnack = (message: string) => {
    setMessage(message);
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = () => setOpen(false);
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <FontAwesomeIcon fontSize={12} icon={faXmark} />
    </IconButton>
  );

  return (
    <SnackContext.Provider value={{ showSnack }}>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={10 * 1000}
        onClose={handleClose}
        message={message}
        action={action}
        ContentProps={{
          sx: {
            border: "1px solid #E2B714",
            bgcolor: "rgba(226, 183, 20, 0.5)",
            "& .MuiSnackbarContent-message": {
              fontFamily: "JetBrains Mono, monospace",
            },
          },
        }}
      />
      {children}
    </SnackContext.Provider>
  );
}
