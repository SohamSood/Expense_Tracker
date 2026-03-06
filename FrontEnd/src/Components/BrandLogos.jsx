import "../CSS/brands.css";

const logos = ["Artistry", "Grapherz", "Signum.", "WAYLINE", "Grapho"];

export default function BrandLogos() {
  return (
    <section className="lp-brands" aria-label="Trusted by">
      {logos.map((logo, index) => (
        <div key={logo} className="lp-brand-logo">
          <span className={`lp-brand-logo__icon icon-${index + 1}`} />
          <span>{logo}</span>
        </div>
      ))}
    </section>
  );
}
