import './ModeSelect.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Carousel from '../../components/Carousel/Carousel';

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
}

export default ModeSelectView;
