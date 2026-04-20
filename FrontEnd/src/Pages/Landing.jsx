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
            <Button size="lg" variant="outline">View Demo</Button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10k+</strong><span>Users</span></div>
            <div className="stat"><strong>₹50M+</strong><span>Tracked</span></div>
            <div className="stat"><strong>4.9/5</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup-container">
            <div className="mockup-dashboard glass">
              <div className="mockup-header" />
              <div className="mockup-grid">
                <div className="mockup-card" />
                <div className="mockup-card" />
                <div className="mockup-chart" />
              </div>
            </div>
            <div className="mockup-floating card-1 glass">
              <PieChart size={24} color="#6366f1" />
              <span>Smart Analysis</span>
            </div>
            <div className="mockup-floating card-2 glass">
              <Zap size={24} color="#10b981" />
              <span>Real-time</span>
            </div>
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
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon" />
              <span>ExpenseTracker</span>
            </div>
            <p>Making financial management accessible for everyone.</p>
          </div>
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Security</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 ExpenseTracker Inc. All rights reserved.</p>
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
