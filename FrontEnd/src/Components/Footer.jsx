import "../CSS/footer.css";

export default function Footer() {
  return (
    <footer className="lp-footer" id="about">
      <div className="lp-footer__grid">
        <div className="lp-footer__brand">
          <a href="#top" className="lp-brand" aria-label="FinanceApp home">
            <span className="lp-brand__mark">
              <span />
            </span>
            <span className="lp-footer__brand-name">FinanceApp</span>
          </a>
          <p>
            Helping people manage and grow their finances smarter.
          </p>
        </div>

        <div>
          <h3>Company</h3>
          <a href="#about">About</a>
          <a href="#about">Careers</a>
          <a href="#about">Press</a>
          <a href="#about">Blog</a>
        </div>

        <div id="features">
          <h3>Product</h3>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#features">Security</a>
          <a href="#features">Integrations</a>
        </div>

        <div>
          <h3>Support</h3>
          <a href="#about">Help Center</a>
          <a href="#about">Contact</a>
          <a href="#about">Privacy Policy</a>
          <a href="#about">Terms of Service</a>
        </div>
      </div>

      <div className="lp-footer__bottom">
        <p>© 2026 FinanceApp. All rights reserved.</p>
      </div>
    </footer>
  );
}
