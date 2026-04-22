import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Code, Globe } from 'lucide-react';
import { Card, Button, Input } from '../Components/ui';
import LoginIllustration from '../Components/LoginIllustration';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const email = e.target[0].value;
      const password = e.target[1].value;
      
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Invalid email or password');
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
              
              <Button type="submit" className="w-full" style={{ marginTop: '1.5rem' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <>Sign in <ArrowRight size={18} /></>}
              </Button>
            </form>

            <p className="signup-prompt" style={{ marginTop: '2rem' }}>
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Sign up for free</a>
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
