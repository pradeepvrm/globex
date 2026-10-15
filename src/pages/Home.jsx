import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <>
          <Navbar />
          <HeroSection />

          <AboutUs />
          <Footer />
        </>
    )
}