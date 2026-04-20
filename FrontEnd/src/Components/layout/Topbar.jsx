import React from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Moon, 
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../ui';

export const Topbar = ({ onMenuClick, user = { name: 'User' } }) => {
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search transactions, bills..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

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
              <button className="dropdown-item">
                <User size={16} /> <span>Profile</span>
              </button>
              <button className="dropdown-item">
                <Settings size={16} /> <span>Settings</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item dropdown-item--danger">
                <LogOut size={16} /> <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
