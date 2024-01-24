import { Box, Icon, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const StartButton = () => {
   const [fontSize, setFontSize] = useState(calculateFontSize());


   useEffect(() => {
     function handleResize() {
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


   return (
       <IconButton sx={{
           fontFamily: "JetBrains Mono, monospace",
           color: "#FFFFFF"
       }}>
           <Box sx={{
               border: '10px solid #646669',
               borderRadius: "30px",
               background: "#E2B714",
               padding: "10px 60px 10px 60px",
               fontWeight: "bolder",
               fontSize: fontSize * 1.1
           }}>
              <Link to="/mode-1-game" 
                style={{
                  textDecoration: 'none',
                  color: 'white'
                }}
              >
                <Box>Start.</Box>
              </Link>
           </Box>
       </IconButton>
   );
}


export default StartButton;
