import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import "@fontsource/jetbrains-mono";

import Typography from '@mui/material/Typography';


const CountdownComponent = ({duration, mode}) => {
  const [count, setCount] = useState(duration);
  const [fontSize, setFontSize] = useState(calculateFontSize());

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (count === 0) {
        clearInterval(countdownInterval);
        // Add your game initialization logic here
      } else {
        setCount((prevCount) => prevCount - 1);
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval); // Cleanup on component unmount
    };
  }, [count]);

  useEffect(() => {
    function handleResize() {
      setFontSize(calculateFontSize());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run effect only once on mount

  function calculateFontSize() {
    // Adjust this logic based on your requirements
    const windowWidth = window.innerWidth;
    const minFontSize = 60;
    const maxFontSize = 262;

    // Calculate the font size based on window dimensions or any other logic
    const calculatedFontSize = Math.min(maxFontSize, Math.max(minFontSize, windowWidth / 4));

    return calculatedFontSize;
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: fontSize,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 'bolder'
      }}
    >
        <Box sx={{ margin: '5px', fontSize: fontSize/7, color: '#D1D0C5', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bolder' }}>
            read as many words as you can.
        </Box>
      <Box sx={{
        width: '400px', // 40% of the viewport width
        height: '400px', // 40% of the viewport height
        
      }}>
          <Typography variant="head1" color={"#D1D0C5"}>{count}</Typography>
      </Box>
    </Box>
  );
};

export default CountdownComponent;