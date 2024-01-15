import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faFacebook, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [iconSize, setIconSize] = useState(calculateIconSize());

  useEffect(() => {
    function handleResize() {
      setIconSize(calculateIconSize());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run effect only once on mount

  function calculateIconSize() {
    // Adjust this logic based on your requirements
    const windowWidth = window.innerWidth;
    const minSize = 12; 
    const maxSize = 36; 

    // Calculate the size based on window dimensions or any other logic
    const calculatedSize = Math.min(maxSize, Math.max(minSize, windowWidth / 15));

    return calculatedSize;
  }

  return (
    <Box
      sx={{
        textAlign: 'center',
        padding: '10px',
        marginTop: '25px', // Add margin top
        marginBottom: '50px', // Add margin bottom
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <IconButton style={{ fontSize: iconSize, marginRight: '30px', marginLeft: '30px', color: '#D1D0C5' }}>
          <FontAwesomeIcon icon={faFacebook} />
        </IconButton>
      </a>
      <a href="https://www.discord.com" target="_blank" rel="noopener noreferrer">
        <IconButton style={{ fontSize: iconSize, marginRight: '30px', marginLeft: '30px', color: '#D1D0C5' }}>
          <FontAwesomeIcon icon={faDiscord} />
        </IconButton>
      </a>
      <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
        <IconButton style={{ fontSize: iconSize, marginRight: '30px', marginLeft: '30px', color: '#D1D0C5' }}>
          <FontAwesomeIcon icon={faXTwitter} />
        </IconButton>
      </a>
    </Box>
  );
};

export default Footer;