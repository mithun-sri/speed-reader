import "./App.css";
import CountdownComponent from "./components/Counter/Counter";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import SpeedSlider from "./components/Slider/Slider";

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
