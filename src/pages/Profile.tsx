import { usePrivy } from '@privy-io/react-auth';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const { user, ready, linkWallet, linkEmail, linkTwitter, createWallet } = usePrivy();

  if (!ready || !user) return null;

  const connectedAccounts = user.linkedAccounts;
  const hasEmbeddedWallet = connectedAccounts.some(account => account.type === 'smart_wallet');

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user.email?.toString().charAt(0).toUpperCase() || '👤'}
            </div>
            <h1>My Profile</h1>
          </div>
        </div>
        
        <div className={styles.profileCard}>
          <h2>🎯 Basic Information</h2>
          <div className={styles.infoGrid}>
            {user.email && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>📧 Email</span>
                <span className={styles.infoValue}>{user.email.toString()}</span>
              </div>
            )}
            {user.twitter?.username && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>🐦 Twitter</span>
                <span className={styles.infoValue}>@{user.twitter.username}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.profileCard}>
          <h2>🔗 Connected Accounts</h2>
          <div className={styles.accountsList}>
            {connectedAccounts.map((account, index) => (
              <div key={index} className={styles.accountItem}>
                <div className={styles.accountInfo}>
                  <span className={styles.accountIcon}>
                    {account.type === 'wallet' && '👛'}
                    {account.type === 'email' && '📧'}
                    {account.type === 'twitter_oauth' && '🐦'}
                  </span>
                  <div className={styles.accountDetails}>
                    <span className={styles.accountName}>
                      {account.type === 'wallet' && `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                      {account.type === 'email' && account.address}
                      {account.type === 'twitter_oauth' && 'Twitter Account'}
                    </span>
                    <span className={styles.accountType}>{account.type}</span>
                  </div>
                </div>
                <div className={styles.accountStatus}>
                  <span className={styles.statusBadge}>Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.profileCard}>
          <h2>🔌 Connect More</h2>
          <div className={styles.buttonGroup}>
            <button onClick={() => linkWallet()} className={styles.connectButton}>
              <span className={styles.buttonIcon}>👛</span>
              Connect Wallet
            </button>
            <button onClick={() => linkEmail()} className={styles.connectButton}>
              <span className={styles.buttonIcon}>📧</span>
              Connect Email
            </button>
            <button onClick={() => linkTwitter()} className={styles.connectButton}>
              <span className={styles.buttonIcon}>🐦</span>
              Connect Twitter
            </button>
          </div>
        </div>

        {!hasEmbeddedWallet && (
          <div className={styles.profileCard}>
            <h2>✨ Create Embedded Wallet</h2>
            <div className={styles.buttonGroup}>
              <button onClick={() => createWallet()} className={styles.createWallet}>
                <span className={styles.buttonIcon}>🌟</span>
                Create Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 