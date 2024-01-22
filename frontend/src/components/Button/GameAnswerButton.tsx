import { Box, Icon, IconButton } from "@mui/material";
import { useEffect, useState } from "react";


const GameAnswerButton: React.FC<{
    text: string;
}> = ({ text }) => {
   const [fontSize, setFontSize] = useState(calculateFontSize());
   const [innerWidth, setInnerWidth] = useState(calculateWidthSize());

   useEffect(() => {
     function handleResize() {
        setInnerWidth(calculateWidthSize());
       setFontSize(calculateFontSize());
     }

      window.addEventListener("resize", handleResize);
      return () => {
       window.removeEventListener("resize", handleResize);
     };
   }, []);
  
   function calculateFontSize() {
     const windowWidth = window.innerWidth;
     const minSize = 12;
     const maxSize = 36;
      const calculatedSize = Math.min(
       maxSize,
       Math.max(minSize, windowWidth / 15)
     );
      return calculatedSize;
   }

   function calculateWidthSize() {
    const windowWidth = window.innerWidth;
    const minWidthPercent = 40; // Set a minimum width as a percentage of the window width
    const maxWidthPercent = 80; // Set a maximum width as a percentage of the window width
    const borderWidth = 20; 
    const paddingWidth = 40;
  
    // Calculate the maximum available width for the box content as a percentage of the window width
    const maxContentWidth = (maxWidthPercent / 100) * windowWidth - borderWidth - paddingWidth;
  
    // Ensure the box content width is at least the minimum
    const calculatedSize = Math.max((minWidthPercent / 100) * windowWidth, Math.min(maxContentWidth, windowWidth / 20));
  
    // Ensure the entire box (including border and padding) fits within the window width
    return Math.min(calculatedSize, windowWidth - borderWidth);
  }

   return (
       <IconButton sx={{
           fontFamily: "JetBrains Mono, monospace",
           color: "#FFFFFF"
       }}>
           <Box sx={{
               width: innerWidth,
               border: '10px solid #646669',
               borderRadius: "30px",
               background: "#E2B714",
               padding: "10px 20px 10px 20px",
               fontWeight: "bolder",
               fontSize: fontSize / 1.15,
               wordWrap: "break-word",
               textAlign: "center"
           }}>
               <Box>{text}.</Box>
           </Box>
       </IconButton>
   );
}


export default GameAnswerButton;
