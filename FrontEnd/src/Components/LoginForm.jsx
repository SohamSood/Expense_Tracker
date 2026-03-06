import { useState } from "react";
import SocialLogin from "./SocialLogin";
import "../CSS/login.css";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="et-login-form">
      <div className="et-login-card">
        <div className="et-login-brand" aria-label="Expense Tracker logo">
          <span className="et-login-brand__icon">ET</span>
          <span className="et-login-brand__text">Expense Tracker</span>
        </div>

        <div className="et-login-header">
          <h1>Login to your Expense Tracker</h1>
          <p>
            Sign in to manage your expenses, track spending, and monitor your
            financial activity.
          </p>
        </div>

        <form className="et-login-fields">
          <label className="et-field">
            <span>Email</span>
            <div className="et-field__control">
              <span className="et-field__icon">@</span>
              <input type="email" placeholder="Enter your email address" />
            </div>
          </label>

          <label className="et-field">
            <span>Password</span>
            <div className="et-field__control">
              <span className="et-field__icon">*</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="et-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="et-login-options">
            <label className="et-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="et-login-submit">
            Login
          </button>
        </form>

        <SocialLogin />
      </div>
    </section>
  );
}
