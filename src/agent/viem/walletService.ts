import { formatEther, type Chain } from 'viem';
import { RemoWallet, TransactionRequest, TransactionResponse } from './types';
import { dynamoDBService } from '../../utils/dynamoDBService';
import { DEFAULT_NETWORK, createNetworkClients } from './networks';

class WalletService {
  private static instance: WalletService;
  private wallets: Map<string, RemoWallet> = new Map();
  private selectedWalletId: string | null = null;
  private userId: string | null = null;
  private network: Chain = DEFAULT_NETWORK;
  private clients = createNetworkClients(DEFAULT_NETWORK);

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async initializeForUser(userId: string) {
    console.log('Initializing wallet service for user:', userId);
    console.log('Previous state:', {
      selectedWalletId: this.selectedWalletId,
      walletCount: this.wallets.size
    });
    
    this.userId = userId;
    
    try {
      // Load wallets from DynamoDB
      console.log('Loading wallets from DynamoDB...');
      const wallets = await dynamoDBService.getUserWallets(userId);
      console.log('Loaded wallets:', wallets);
      
      // Update local cache
      this.wallets.clear();
      wallets.forEach(wallet => {
        this.wallets.set(wallet.id, wallet);
      });
      
      // Maintain selected wallet if it still exists
      if (this.selectedWalletId && !this.wallets.has(this.selectedWalletId)) {
        console.log('Previously selected wallet no longer exists, clearing selection');
        this.selectedWalletId = null;
      }
      
      console.log('Wallet service initialized:', {
        selectedWalletId: this.selectedWalletId,
        walletCount: this.wallets.size,
        wallets: Array.from(this.wallets.values())
      });
    } catch (error) {
      console.error('Error initializing wallet service:', error);
      throw error;
    }
  }

  async createWallet(name: string): Promise<RemoWallet> {
    if (!this.userId) {
      throw new Error('No user ID set');
    }

    try {
      console.log('Creating new wallet for user:', this.userId);
      
      // Generate random private key
      const privateKey = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      console.log('Generated private key successfully');

      // Create clients with the private key
      const { walletClient } = createNetworkClients(this.network, privateKey);
      if (!walletClient?.account) {
        throw new Error('Failed to create wallet client');
      }

      const address = walletClient.account.address;
      console.log('Created account with address:', address);
      
      const wallet: RemoWallet = {
        id: address,
        address,
        name,
        type: 'agent_wallet',
        createdAt: Date.now(),
        balance: '0.0',
        privateKey,
        userId: this.userId
      };

      console.log('Attempting to save wallet to DynamoDB...');
      try {
        await dynamoDBService.saveWallet(this.userId, wallet);
        console.log('Wallet saved successfully to DynamoDB');
      } catch (dbError: unknown) {
        console.error('DynamoDB save failed:', dbError);
        const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error occurred';
        throw new Error(`Failed to save wallet to database: ${errorMessage}`);
      }

      this.wallets.set(wallet.id, wallet);
      console.log('Wallet added to local cache');
      
      return wallet;
    } catch (error: any) {
      console.error('Error in createWallet:', {
        error: error.message,
        stack: error.stack,
        userId: this.userId,
      });
      throw new Error(`Failed to create wallet: ${error.message}`);
    }
  }

  async deleteWallet(walletId: string): Promise<boolean> {
    if (!this.userId) {
      throw new Error('No user ID set');
    }

    try {
      await dynamoDBService.deleteWallet(this.userId, walletId);
      this.wallets.delete(walletId);
      if (this.selectedWalletId === walletId) {
        this.selectedWalletId = null;
      }
      return true;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw new Error('Failed to delete wallet');
    }
  }

  async sendTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    try {
      const wallet = this.getSelectedWallet();
      if (!wallet) {
        throw new Error('No wallet selected');
      }

      // Create clients with the wallet's private key
      const { publicClient, walletClient } = createNetworkClients(this.network, wallet.privateKey);
      if (!walletClient?.account) {
        throw new Error('Failed to create wallet client');
      }

      // Get current balance with retries
      let balance;
      let retryCount = 3;
      while (retryCount > 0) {
        try {
          console.log(`Attempting to get balance... (${retryCount} attempts left)`);
          balance = await publicClient.getBalance({ 
            address: wallet.address as `0x${string}` 
          });
          break;
        } catch (error: any) {
          console.error('Balance check error:', error);
          retryCount--;
          if (retryCount === 0) {
            throw new Error(`Failed to check balance after multiple attempts: ${error.message}`);
          }
          console.log(`Retrying balance check... (${retryCount} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!balance) {
        throw new Error('Could not retrieve wallet balance');
      }

      const balanceInEth = formatEther(balance);
      console.log(`Current balance: ${balanceInEth} ETH`);
      
      const requestValue = BigInt(request.value);
      if (balance < requestValue) {
        throw new Error(`Insufficient balance. Current balance: ${balanceInEth} ETH, Required: ${formatEther(requestValue)} ETH`);
      }

      // Send transaction with retries
      retryCount = 3;
      while (retryCount > 0) {
        try {
          console.log(`Attempting to send transaction... (${retryCount} attempts left)`);
          const hash = await walletClient.sendTransaction({
            account: walletClient.account,
            chain: this.network,
            to: request.to as `0x${string}`,
            value: requestValue,
            data: request.data ? request.data as `0x${string}` : undefined,
          });

          console.log('Transaction sent successfully:', hash);
          return {
            hash,
            from: request.from,
            to: request.to,
            value: request.value,
            status: 'pending',
            timestamp: Date.now(),
          };
        } catch (error: any) {
          console.error('Transaction attempt failed:', error);
          retryCount--;
          if (retryCount === 0) {
            throw error;
          }
          console.log('Transaction failed, retrying in 2 seconds...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      throw new Error('All transaction attempts failed');
    } catch (error: any) {
      console.error('Transaction error details:', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      
      if (error.message.includes('timeout') || error.message.includes('took too long')) {
        throw new Error('Network is congested. Please try again in a few minutes.');
      }

      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        throw new Error('Network connection error. Please check your connection and try again.');
      }

      throw error;
    }
  }

  async updateWalletBalance(walletId: string): Promise<void> {
    const wallet = this.wallets.get(walletId);
    if (wallet) {
      const balance = await this.clients.publicClient.getBalance({ 
        address: wallet.address as `0x${string}` 
      });
      wallet.balance = formatEther(balance);
      this.wallets.set(walletId, wallet);
    }
  }

  setSelectedWallet(walletId: string) {
    console.log('Setting selected wallet with ID:', walletId);
    console.log('Current wallets:', Array.from(this.wallets.entries()));
    
    if (!this.wallets.has(walletId)) {
      console.error('Wallet not found in available wallets');
      throw new Error('Wallet not found');
    }

    this.selectedWalletId = walletId;
    const wallet = this.wallets.get(walletId);
    console.log('Successfully set selected wallet:', {
      selectedId: this.selectedWalletId,
      wallet: wallet
    });
    return wallet;
  }

  getSelectedWallet(): RemoWallet | null {
    console.log('Getting selected wallet...');
    console.log('Current selectedWalletId:', this.selectedWalletId);
    console.log('Available wallets:', Array.from(this.wallets.entries()));
    
    if (!this.selectedWalletId) {
      console.log('No wallet currently selected');
      return null;
    }
    
    const wallet = this.wallets.get(this.selectedWalletId);
    console.log('Retrieved selected wallet:', wallet);
    return wallet || null;
  }

  getWallets(): RemoWallet[] {
    return Array.from(this.wallets.values());
  }
}

export const walletService = WalletService.getInstance(); 