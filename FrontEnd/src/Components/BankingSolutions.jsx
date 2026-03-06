import "../CSS/banking.css";
import womanImage from "../assets/images.jpg";

const points = [
  "24/7 Account Access",
  "Advanced Data Security",
  "Secure & Seamless Transfers",
  "Personalized Financial Insights",
];

export default function BankingSolutions() {
  return (
    <section className="lp-banking" id="business">
      <div className="lp-banking__content">
        <div className="lp-banking__copy">
          <p className="lp-banking__eyebrow">Flexible banking tools</p>
          <h2>Your Goals, Our Flexible Banking Solutions</h2>
          <p className="lp-banking__text">
            Simplify how you manage money with an all-in-one solution designed
            for real life. From budgeting and saving to planning and growing,
            gain complete control.
          </p>

          <ul className="lp-banking__list">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="lp-banking__visual" aria-hidden="true">
          <div className="lp-banking__image">
            <img src={womanImage} alt="Financial planning" />
          </div>
        </div>
      </div>
    </section>
  );
}
