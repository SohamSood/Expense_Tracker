import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Code, Globe } from 'lucide-react';
import { Card, Button, Input } from '../Components/ui';
import LoginIllustration from '../Components/LoginIllustration';
import { api } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const email = e.target[0].value;
      const password = e.target[1].value;
      
      const res = await api.post('/auth/login', { email, password });
      if (res.message === "Login successfully") {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand" onClick={() => navigate('/')}>
            <div className="logo-icon" />
            <span>ExpenseTracker</span>
          </div>
          
          <div className="login-content">
            <h1>Welcome back</h1>
            <p className="login-subtitle">Enter your credentials to access your account</p>
            {errorMsg && <p style={{ color: 'red', marginTop: '0', fontSize: '0.9rem' }}>{errorMsg}</p>}

            <form className="login-form" onSubmit={handleLogin}>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
              />
              
              <div className="login-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Sign in <ArrowRight size={18} /></>}
              </Button>
            </form>

            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-login">
              <Button variant="outline" className="w-full">
                <Globe size={18} /> Google
              </Button>
              <Button variant="outline" className="w-full">
                <Code size={18} /> GitHub
              </Button>
            </div>

            <p className="signup-prompt">
              Don't have an account? <a href="#">Sign up for free</a>
            </p>
          </div>
        </div>
        
        <div className="login-right" style={{ padding: '24px 24px 24px 0' }}>
          <LoginIllustration />
        </div>
      </div>
    </div>
  );
}
