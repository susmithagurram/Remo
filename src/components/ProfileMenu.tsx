import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ProfileMenu.module.css';

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
    <div className={styles.profileMenu}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={styles.menuButton}
      >
        <span>{displayText}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuItems} role="menu">
            <button
              onClick={() => navigate('/profile')}
              className={styles.menuItem}
              role="menuitem"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className={styles.menuItem}
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