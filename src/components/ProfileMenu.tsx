import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileMenu.scss';

const ProfileMenu = () => {
  const { user, logout, ready } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!ready || !user) return null;

  const loginMethod = user.linkedAccounts[0];
  const displayText = loginMethod?.type === 'wallet' 
    ? `${loginMethod.address.slice(0, 6)}...${loginMethod.address.slice(-4)}`
    : loginMethod?.type === 'email'
    ? user.email?.toString()
    : loginMethod?.type === 'twitter_oauth'
    ? user.twitter?.username
    : 'Unknown';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="profile-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="menu-button"
      >
        <span>{displayText}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="menu-items" role="menu">
            <button
              onClick={() => navigate('/profile')}
              className="menu-item"
              role="menuitem"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="menu-item"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 