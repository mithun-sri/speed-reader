import './ModeSelect.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Box from '@mui/material/Box';

const ModeSelectView = () => {
  return (
    <div className="ModeSelect">
      <Header />
      <header className="ModeSelect-header">
        <Box sx={{ margin: '20px', fontSize: 40, color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bolder' }}>
          choose game mode.
        </Box>
        <Footer />
      </header>
    </div>
  );
}

export default ModeSelectView;
