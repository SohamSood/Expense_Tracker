import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Receipt, 
  CreditCard, 
  Settings, 
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../ui';

const sideItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Add Bill', icon: PlusCircle, path: '/add-bill' },
  { label: 'View Bills', icon: Receipt, path: '/view-bills' },
  { label: 'Upload Receipt', icon: Receipt, path: '/upload-receipt' },
  { label: 'Cards', icon: CreditCard, path: '#' },
  { label: 'Settings', icon: Settings, path: '#' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

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
            <button className="nav-item">
              <HelpCircle size={20} className="nav-icon" />
              <span>Support</span>
            </button>
            <button className="nav-item nav-item--logout">
              <LogOut size={20} className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
