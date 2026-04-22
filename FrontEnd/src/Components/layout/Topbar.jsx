import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../ui';

export const Topbar = ({ onMenuClick, user = { name: 'User' } }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
      </div>

      <div className="topbar-right">
        <div className="profile-container">
          <button 
            className="profile-btn" 
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="avatar">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-meta">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role">Premium Plan</span>
            </div>
            <ChevronDown size={16} className={cn('chevron', showProfile && 'chevron--rotated')} />
          </button>

          {showProfile && (
            <div className="profile-dropdown glass">
              <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowProfile(false); }}>
                <SettingsIcon size={16} /> <span>Settings</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
