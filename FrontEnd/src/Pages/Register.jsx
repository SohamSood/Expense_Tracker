import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Code, Globe, User as UserIcon } from 'lucide-react';
import { Card, Button, Input } from '../Components/ui';
import LoginIllustration from '../Components/LoginIllustration';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const name = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;
      
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Registration failed');
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
            <h1>Create an account</h1>
            <p className="login-subtitle">Join us to manage your finances</p>
            {errorMsg && <p style={{ color: 'red', marginTop: '0', fontSize: '0.9rem' }}>{errorMsg}</p>}

            <form className="login-form" onSubmit={handleRegister}>
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                required
              />
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
              
              <Button type="submit" className="w-full" disabled={loading} style={{ marginTop: '1.5rem' }}>
                {loading ? <Loader2 className="animate-spin" /> : <>Sign up <ArrowRight size={18} /></>}
              </Button>
            </form>

            <p className="signup-prompt" style={{ marginTop: '2rem' }}>
              Already have an account? <a href="#" onClick={() => navigate('/login')}>Sign in here</a>
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
