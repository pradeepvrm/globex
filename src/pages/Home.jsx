import AboutUs from "../components/AboutUs";
import BrandBanner from "../components/BrandBanner";
import CustomerTestimonials from "../components/CustomerTestimonials";
import DealsOfTheDay from "../components/DealsOfTheDay";
import FeaturedBlogs from "../components/FeaturedBlogs";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InviteBanner from "../components/InviteBanner";
import Navbar from "../components/Navbar";
import ServiceBenefits from "../components/ServiceBenefits";
import ShopByCategories from "../components/ShopByCategories";
import TrendingNow from "../components/TrendingNow";
import TrendingOffers from "../components/TrendingOffers";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="home-page">
        <InviteBanner />
        <HeroSection />
        <TrendingNow />
        <DealsOfTheDay />
        <TrendingOffers />
        <BrandBanner />
        <ShopByCategories />
        <CustomerTestimonials />
        <FeaturedBlogs />
        <ServiceBenefits />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}