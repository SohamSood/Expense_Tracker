import { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="lp-navbar">
      <div className="lp-navbar__inner">
        <Link to="/" className="lp-brand" aria-label="FinanceApp home">
          <span className="lp-brand__mark">
            <span />
          </span>
        </Link>

        <button
          type="button"
          className="lp-menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`lp-nav ${menuOpen ? "is-open" : ""}`}>
          <a href="#business">Business</a>
          <a href="#pricing">Pricing</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link
            to="/login"
            className="lp-login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
