import LoginForm from "../Components/LoginForm";
import LoginIllustration from "../Components/LoginIllustration";

export default function Login() {
  return (
    <main className="et-login-page">
      <div className="et-login-shell">
        <div className="et-login-left">
          <LoginForm />
        </div>
        <div className="et-login-right">
          <LoginIllustration />
        </div>
      </div>
    </main>
  );
}
