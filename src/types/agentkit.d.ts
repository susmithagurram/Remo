declare module '@coinbase/agentkit/typescript/agentkit' {
  export interface AgentWallet {
    address: string;
    id: string;
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

  export function createAgentKit(config: {
    chainId: number;
    rpcUrl: string;
  }): Promise<AgentKit>;
} 