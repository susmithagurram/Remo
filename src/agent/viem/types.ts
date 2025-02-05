export interface RemoWallet {
  id: string;
  address: string;
  name: string;
  type: 'agent_wallet';
  createdAt: number;
  balance?: string;
  privateKey: string;
  userId?: string;
}

export interface TransactionRequest {
  from: string;
  to: string;
  value: string;
  data?: string;
}

export interface TransactionResponse {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface WalletState {
  selectedWallet: RemoWallet | null;
  wallets: RemoWallet[];
  isLoading: boolean;
  error: string | null;
}

export interface Contact {
  id: string;
  contactId: string;
  userId: string;
  name: string;
  walletAddress: string;
  createdAt: number;
  updatedAt: number;
} 