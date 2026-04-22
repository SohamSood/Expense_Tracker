import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Receipt, 
  LogOut,
  X,
  Coins,
  PiggyBank
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../ui';

const sideItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Add Bill', icon: PlusCircle, path: '/add-bill' },
  { label: 'View Bills', icon: Receipt, path: '/view-bills' },
  { label: 'Upload Receipt', icon: Receipt, path: '/upload-receipt' },
  { label: 'Digital Gold', icon: Coins, path: '/gold' },
  { label: 'FD Calculator', icon: PiggyBank, path: '/fd' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
        />
      )}

      <aside className={cn('sidebar', isOpen && 'sidebar--open')}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon" />
            <span className="logo-text">ExpenseTracker</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-label">Main Menu</p>
            {sideItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.label}
                  className={cn('nav-item', isActive && 'nav-item--active')}
                  onClick={() => {
                    if (item.path !== '#') navigate(item.path);
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <Icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                  {isActive && <div className="active-indicator" />}
                </button>
              );
            })}
          </div>

          <div className="nav-section nav-section--bottom">
            <button className="nav-item nav-item--logout" onClick={handleLogout}>
              <LogOut size={20} className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
