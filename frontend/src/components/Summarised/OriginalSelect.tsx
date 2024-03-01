import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DiffSelect from "../../views/DiffSelect/DiffSelect";

const OriginalSelect: React.FC<{
  size?: number;
}> = ({ size }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      onClick={() => {
        setIsFocused(true);
      }}
      onMouseLeave={() => {
        setIsFocused(false);
      }}
      sx={{
        backgroundColor: "rgba(0,0,0,0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 50px",
        gap: 1.5,
      }}
    >
      <AnimatePresence mode="wait">
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              width: (size || 20) * 4.5,
              height: (size || 20) * 2.65,
              padding: "10px",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#303236",
              position: "absolute",
              zIndex: 1,
              borderRadius: "40px",
              border: "2px solid #646669",
              top: "50%",
              transform: "translateY(-42%)",
            }}
          >
            <IconButton
              style={{
                fontSize: "30px",
                width: "50px",
                position: "absolute",
                top: "20px",
                right: "20px",
              }}
              onClick={(event) => {
                event.stopPropagation();
                setIsFocused(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} color="#D1D0C5" />
            </IconButton>
            <DiffSelect />
          </motion.div>
        )}
      </AnimatePresence>

      <Box
        sx={{
          fontSize: (size || 20) / 4,
          fontWeight: "bolder",
          fontFamily: "JetBrains Mono, monospace",
          cursor: "pointer",
        }}
      >
        Original
      </Box>
      <Box
        sx={{
          fontSize: (size || 20) / 10,
          fontFamily: "JetBrains Mono, monospace",
          color: "#FFFFFF",
          width: "70%",
        }}
      >
        Explore a range of original fiction and non-fiction texts with desired
        text difficulty.
      </Box>
    </Box>
  );
};

export default OriginalSelect;
