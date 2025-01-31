import { usePrivy } from '@privy-io/react-auth';
import '../styles/Profile.scss';

const Profile = () => {
  const { user, ready, linkWallet, linkEmail, linkTwitter, createWallet } = usePrivy();

  if (!ready || !user) return null;

  const connectedAccounts = user.linkedAccounts;
  const hasEmbeddedWallet = connectedAccounts.some(account => account.type === 'smart_wallet');

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar">
              {user.email?.toString().charAt(0).toUpperCase() || '👤'}
            </div>
            <h1>My Profile</h1>
          </div>
        </div>
        
        <div className="profile-card">
          <h2>🎯 Basic Information</h2>
          <div className="info-grid">
            {user.email && (
              <div className="info-item">
                <span className="info-label">📧 Email</span>
                <span className="info-value">{user.email.toString()}</span>
              </div>
            )}
            {user.twitter?.username && (
              <div className="info-item">
                <span className="info-label">🐦 Twitter</span>
                <span className="info-value">@{user.twitter.username}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-card">
          <h2>🔗 Connected Accounts</h2>
          <div className="accounts-list">
            {connectedAccounts.map((account, index) => (
              <div key={index} className="account-item">
                <div className="account-info">
                  <span className="account-icon">
                    {account.type === 'wallet' && '👛'}
                    {account.type === 'email' && '📧'}
                    {account.type === 'twitter_oauth' && '🐦'}
                  </span>
                  <div className="account-details">
                    <span className="account-name">
                      {account.type === 'wallet' && `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                      {account.type === 'email' && account.address}
                      {account.type === 'twitter_oauth' && 'Twitter Account'}
                    </span>
                    <span className="account-type">{account.type}</span>
                  </div>
                </div>
                <div className="account-status">
                  <span className="status-badge">Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <h2>🔌 Connect More</h2>
          <div className="button-group">
            <button onClick={() => linkWallet()} className="connect-button">
              <span className="button-icon">👛</span>
              Connect Wallet
            </button>
            <button onClick={() => linkEmail()} className="connect-button">
              <span className="button-icon">📧</span>
              Connect Email
            </button>
            <button onClick={() => linkTwitter()} className="connect-button">
              <span className="button-icon">🐦</span>
              Connect Twitter
            </button>
          </div>
        </div>

        {!hasEmbeddedWallet && (
          <div className="profile-card">
            <h2>✨ Create Embedded Wallet</h2>
            <div className="button-group">
              <button onClick={() => createWallet()} className="create-wallet">
                <span className="button-icon">🌟</span>
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