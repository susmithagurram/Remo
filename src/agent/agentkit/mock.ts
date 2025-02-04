export interface AgentWallet {
  address: string;
  id: string;
  privateKey: string;
}

export interface AgentKit {
  createWallet(): Promise<AgentWallet>;
  sendTransaction(tx: {
    from: string;
    to: string;
    value: bigint;
    data?: string;
  }): Promise<{ hash: string }>;
}

class MockAgentKit implements AgentKit {
  async createWallet(): Promise<AgentWallet> {
    const id = `wallet_${Date.now()}`;
    const privateKey = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const address = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    return { id, address, privateKey };
  }

  async sendTransaction(tx: { from: string; to: string; value: bigint; data?: string }): Promise<{ hash: string }> {
    const hash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    return { hash };
  }
}

export function createAgentKit(): Promise<AgentKit> {
  return Promise.resolve(new MockAgentKit());
} 