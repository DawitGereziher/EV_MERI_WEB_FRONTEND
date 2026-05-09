import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';
import HowItWorks from './Howitworks';
import Testimonials from './testimonal';
import LandingDescription from './LandingDescription';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <LandingDescription />
      
      <Features />
      <HowItWorks />
      <Testimonials />
      {/* Additional sections can be added here */}
      <Footer />
    </div>
  );
};

export default LandingPage;