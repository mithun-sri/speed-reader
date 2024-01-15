import './App.css';
import SpeedSlider from './components/Slider/Slider';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CountdownComponent from './components/Counter/Counter';
import WordDisplay from './components/WordDisplay/WordDisplay';

function App() {
  return (
    
    <div className="App">
      <Header />
      <header className="App-header">
        <CountdownComponent duration={3} /> 
        <SpeedSlider />
        <Footer />
      </header>
    </div>
  );
}

export default App;
