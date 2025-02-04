import React, { useState, useEffect } from 'react';
import { walletService } from './walletService';
import { RemoWallet } from './types';
import styles from '../../styles/Profile.module.css';

interface RemoWalletsProps {
  onWalletSelect: (wallet: RemoWallet) => void;
}

const RemoWallets: React.FC<RemoWalletsProps> = ({ onWalletSelect }) => {
  const [wallets, setWallets] = useState<RemoWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<RemoWallet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    if (copiedKey) {
      const timer = setTimeout(() => setCopiedKey(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedKey]);

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => setCopiedAddress(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);

  const loadWallets = () => {
    const allWallets = walletService.getWallets();
    setWallets(allWallets);
    const selected = walletService.getSelectedWallet();
    if (selected) {
      setSelectedWallet(selected);
    }
  };

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      const wallet = await walletService.createWallet(newWalletName.trim());
      setWallets([...wallets, wallet]);
      setNewWalletName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setError('Failed to create wallet. Please try again.');
      setIsCreating(false);
    }
  };

  const handleSelectWallet = (wallet: RemoWallet) => {
    walletService.setSelectedWallet(wallet.id);
    setSelectedWallet(wallet);
    onWalletSelect(wallet);
  };

  const copyPrivateKey = async (privateKey: string) => {
    try {
      await navigator.clipboard.writeText(privateKey);
      setCopiedKey(privateKey);
    } catch (err) {
      console.error('Failed to copy private key:', err);
    }
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className={styles.profileCard}>
      <h2>💼 Remo Wallets</h2>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.walletsList}>
        {wallets.map((wallet) => (
          <div 
            key={wallet.id}
            className={`${styles.walletItem} ${selectedWallet?.id === wallet.id ? styles.selected : ''}`}
          >
            <div className={styles.walletInfo}>
              <span className={styles.walletIcon}>💼</span>
              <div className={styles.walletDetails}>
                <span className={styles.walletName}>{wallet.name}</span>
                <div className={styles.addressContainer}>
                  <span className={styles.walletAddress}>
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </span>
                  <button
                    onClick={() => copyAddress(wallet.address)}
                    className={styles.copyAddressButton}
                    title="Copy full address"
                  >
                    {copiedAddress === wallet.address ? '✓' : '📋'}
                  </button>
                </div>
                <div className={styles.walletActions}>
                  <button
                    onClick={() => handleSelectWallet(wallet)}
                    className={styles.selectButton}
                  >
                    {selectedWallet?.id === wallet.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={() => copyPrivateKey(wallet.privateKey)}
                    className={styles.copyButton}
                  >
                    {copiedKey === wallet.privateKey ? 'Copied!' : 'Copy Private Key'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.createWalletForm}>
        <input
          type="text"
          value={newWalletName}
          onChange={(e) => setNewWalletName(e.target.value)}
          placeholder="Enter wallet name"
          className={styles.walletNameInput}
          disabled={isCreating}
        />
        <button
          onClick={handleCreateWallet}
          className={styles.createWalletButton}
          disabled={isCreating || !newWalletName.trim()}
        >
          {isCreating ? 'Creating...' : 'Create Wallet'}
        </button>
      </div>
    </div>
  );
};

export default RemoWallets; 