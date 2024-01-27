import Carousel from "../../components/Carousel/Carousel";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./ModeSelect.css";

const ModeSelectView = () => {
  return (
    <div className="ModeSelect">
      <Header />
      <header className="ModeSelect-header">
        <Carousel />
        <Footer />
      </header>
    </div>
  );
};

export default ModeSelectView;
