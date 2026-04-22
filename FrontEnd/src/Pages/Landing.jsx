import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  PieChart, 
  Globe,
  Lock,
  Smartphone
} from 'lucide-react';
import { Button, Card, Badge, cn } from '../Components/ui';
import heroImage from '../assets/hero_illustration.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">
          <div className="logo-icon" />
          <span>ExpenseTracker</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/login')}>Login</button>
          <Button onClick={() => navigate('/login')}>Get Started</Button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <Badge variant="primary" className="hero-badge">New: Automatic Receipt Scanning</Badge>
          <h1>Master Your Money with <span className="gradient-text">Intelligence.</span></h1>
          <p>The modern expense tracker designed for individuals and teams who care about financial clarity and growth.</p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => navigate('/login')}>
              Start for free <ArrowRight size={20} />
            </Button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10k+</strong><span>Users</span></div>
            <div className="stat"><strong>₹50M+</strong><span>Tracked</span></div>
            <div className="stat"><strong>4.9/5</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup-container">
            <img 
              src={heroImage} 
              alt="Smart Financial Management Dashboard" 
              style={{ 
                width: '100%', 
                maxWidth: '600px', 
                borderRadius: '24px', 
                boxShadow: 'var(--shadow-lg)' 
              }} 
            />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Everything you need to <span className="gradient-text">scale.</span></h2>
          <p>A suite of powerful tools to help you manage every aspect of your financial life.</p>
        </div>
        <div className="features-grid">
          <FeatureCard 
            icon={<ShieldCheck size={32} />}
            title="Secure Payments"
            description="Enterprise-grade security for all your financial data and transactions."
          />
          <FeatureCard 
            icon={<PieChart size={32} />}
            title="Advanced Analytics"
            description="Beautiful charts and insights to help you understand your spending habits."
          />
          <FeatureCard 
            icon={<Zap size={32} />}
            title="Fast Processing"
            description="Scan receipts and record expenses in seconds with our optimized engine."
          />
          <FeatureCard 
            icon={<Globe size={32} />}
            title="Multi-currency"
            description="Support for over 130+ currencies with real-time conversion rates."
          />
          <FeatureCard 
            icon={<Lock size={32} />}
            title="Privacy First"
            description="Your data is encrypted and never sold. You are always in control."
          />
          <FeatureCard 
            icon={<Smartphone size={32} />}
            title="Mobile Ready"
            description="A seamless experience across all your devices, from desktop to mobile."
          />
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-cta">
          <h2>Ready to take control of your finances?</h2>
          <Button size="lg" onClick={() => navigate('/login')} className="mt-4">
            Join ExpenseTracker Today <ArrowRight size={20} />
          </Button>
        </div>
        <div className="footer-bottom">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            <div className="logo-icon" />
            <span>ExpenseTracker</span>
          </div>
          <p>&copy; {new Date().getFullYear()} ExpenseTracker Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
}
