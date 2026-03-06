import { useNavigate } from "react-router-dom";
import LoginForm from "../Components/LoginForm";
import LoginIllustration from "../Components/LoginIllustration";

export default function Login() {
  const navigate = useNavigate();

  return (
    <main className="et-login-page">
      <div className="et-login-shell">
        <div className="et-login-left">
          <LoginForm onLogin={() => navigate("/dashboard")} />
        </div>
        <div className="et-login-right">
          <LoginIllustration />
        </div>
      </div>
    </main>
  );
}
