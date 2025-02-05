import { type Chain, createPublicClient, http, createWalletClient, type WalletClient, type PublicClient } from 'viem';
import { sepolia, mainnet, goerli } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Export the chains directly
export const chains = {
  sepolia,
  mainnet,
  goerli
} as const;

// Create clients for each network
export function createNetworkClients(chain: Chain, privateKey?: string): {
  publicClient: PublicClient;
  walletClient?: WalletClient;
} {
  const transport = http(chain.rpcUrls.default.http[0], {
    batch: true,
    retryCount: 3,
    retryDelay: 1000,
    timeout: 20000,
  });

  const publicClient = createPublicClient({
    chain,
    transport
  });

  if (privateKey) {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain,
      transport
    });
    return { publicClient, walletClient };
  }

  return { publicClient };
}

// Export network configurations
export const NETWORKS = {
  SEPOLIA: {
    ...sepolia,
    client: createPublicClient({
      chain: sepolia,
      transport: http(sepolia.rpcUrls.default.http[0], {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 20000,
      })
    })
  },
  MAINNET: {
    ...mainnet,
    client: createPublicClient({
      chain: mainnet,
      transport: http(mainnet.rpcUrls.default.http[0], {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 20000,
      })
    })
  },
  GOERLI: {
    ...goerli,
    client: createPublicClient({
      chain: goerli,
      transport: http(goerli.rpcUrls.default.http[0], {
        batch: true,
        retryCount: 3,
        retryDelay: 1000,
        timeout: 20000,
      })
    })
  }
} as const;

// Helper function to get network by chain ID
export function getNetwork(chainId: number): Chain & { client: PublicClient } {
  const network = Object.values(NETWORKS).find(n => n.id === chainId);
  if (!network) {
    throw new Error(`Network not found for chain ID ${chainId}`);
  }
  return network;
}

export function getNetworkByName(name: string): Chain & { client: PublicClient } {
  const network = NETWORKS[name.toUpperCase() as keyof typeof NETWORKS];
  if (!network) {
    throw new Error(`Network not found: ${name}`);
  }
  return network;
}

// Default network
export const DEFAULT_NETWORK = NETWORKS.SEPOLIA; 