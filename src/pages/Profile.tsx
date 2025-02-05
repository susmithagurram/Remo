import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import styles from '../styles/Profile.module.css';
import { dynamoDBService } from '../utils/dynamoDBService';
import RemoWallets from '../agent/viem/RemoWallets';
import { RemoWallet } from '../agent/viem/types';
import { walletService } from '../agent/viem/walletService';

const Profile = () => {
  const { user, ready, linkWallet, linkEmail, linkTwitter, createWallet } = usePrivy();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Helper function to get user's unique ID
  const getUserId = () => {
    if (!user) return null;
    // Use wallet address as primary identifier if available
    const walletAccount = user.linkedAccounts?.find(account => account.type === 'wallet');
    if (walletAccount?.address) return walletAccount.address;
    // Fallback to email if no wallet
    if (user.email) return user.email.toString();
    return null;
  };

  // Helper function to get default username
  const getDefaultUsername = () => {
    if (!user) return 'Guest';
    const walletAccount = user.linkedAccounts?.find(account => account.type === 'wallet');
    if (walletAccount?.address) {
      return `${walletAccount.address.slice(0, 6)}...${walletAccount.address.slice(-4)}`;
    }
    if (user.email?.toString()) {
      return user.email.toString().split('@')[0];
    }
    if (user.twitter?.username) {
      return `@${user.twitter.username}`;
    }
    return 'Guest';
  };

  // Load user data from DynamoDB
  useEffect(() => {
    const loadUserData = async () => {
      if (ready && user) {
        const userId = getUserId();
        if (userId) {
          setIsLoading(true);
          setError(null);
          try {
            // Initialize wallet service for this user
            await walletService.initializeForUser(userId);

            const userData = await dynamoDBService.getUserData(userId);
            if (userData) {
              setUsername(userData.username);
            } else {
              const defaultUsername = getDefaultUsername();
              setUsername(defaultUsername);
              await dynamoDBService.updateUserData({
                userId,
                username: defaultUsername,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            setError('Failed to load user data. Please try again later.');
            setUsername(getDefaultUsername());
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    loadUserData();
  }, [ready, user]);

  const handleUsernameSubmit = async () => {
    if (!username.trim() || !user) return;

    const userId = getUserId();
    if (!userId) return;

    const newUsername = username.trim();
    setIsSaving(true);
    setError(null);
    
    try {
      await dynamoDBService.updateUserData({
        userId,
        username: newUsername,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setIsEditingUsername(false);
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to save username. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWalletSelect = (wallet: RemoWallet) => {
    console.log('Selected wallet:', wallet);
  };

  if (!ready || !user || isLoading) return null;

  const connectedAccounts = user.linkedAccounts;
  const hasEmbeddedWallet = connectedAccounts.some(account => account.type === 'smart_wallet');

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {username.charAt(0).toUpperCase()}
            </div>
            <h1>My Profile</h1>
          </div>
        </div>
        
        <div className={styles.profileCard}>
          <h2>🎯 Basic Information</h2>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>👤 Username</span>
              <div className={styles.infoValue}>
                {isEditingUsername ? (
                  <div className={styles.usernameEdit}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={styles.usernameInput}
                      autoFocus
                      disabled={isSaving}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isSaving) {
                          handleUsernameSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleUsernameSubmit}
                      className={styles.saveButton}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <div className={styles.usernameDisplay}>
                    <span>{username}</span>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className={styles.editButton}
                      disabled={isSaving}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
            {user.twitter?.username && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>🐦 Twitter</span>
                <span className={styles.infoValue}>@{user.twitter.username}</span>
              </div>
            )}
          </div>
        </div>

        <RemoWallets onWalletSelect={handleWalletSelect} />

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
                      {account.type === 'twitter_oauth' && `@${user.twitter?.username}`}
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