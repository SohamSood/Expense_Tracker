import "../CSS/hero.css";

import image from "../assets/image.png";
import download from "../assets/download.jpg";
import group from "../assets/group.jpg";
export default function HeroSection() {
  return (
    <section className="lp-hero" id="top">
      <div className="lp-hero__content">
        <p className="lp-hero__eyebrow">Bank-level digital finance</p>
        <h1>
          Secure <span>Solutions</span> for Smarter Money Moves.
        </h1>
        <p className="lp-hero__text">
          Our platform helps you manage, track, and optimize your finances with
          ease all backed by bank-level security and real-time insights.
        </p>

        <div className="lp-hero__actions">
          <button type="button" className="lp-btn lp-btn--primary">
            Get Started
          </button>
          <button type="button" className="lp-btn lp-btn--ghost">
            View Demo
          </button>
        </div>
      </div>

      <div className="lp-hero__visual">
        <div className="lp-visual-grid">
          <div className="lp-visual-card">
            <img src={image} alt="Image" />
          </div>

          <div className="lp-visual-card">
            <img src={download} alt="Image" />
          </div>

          <div className="lp-visual-card">
            <img src={group} alt="Image" />
          </div>

          <button className="lp-explore-badge">Explore</button>
        </div>
      </div>
    </section>
  );
}
