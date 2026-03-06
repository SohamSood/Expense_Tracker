import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import FinancialSnapshot from "../Components/FinancialSnapshot";
import BrandLogos from "../Components/BrandLogos";
import BankingSolutions from "../Components/BankingSolutions";
import Footer from "../Components/Footer";
import "../CSS/landing.css";

export default function Landing() {
  return (
    <main className="lp-page">
      <div className="lp-orb lp-orb--left" />
      <div className="lp-orb lp-orb--right" />

      <section className="lp-surface">
        <div className="lp-content">
          <Navbar />
          <HeroSection />
          <FinancialSnapshot />
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-content">
          <BrandLogos />
          <BankingSolutions />
        </div>
      </section>

      <Footer />
    </main>
  );
}
