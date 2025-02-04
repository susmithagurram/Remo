import { TransactionRequest } from './types';

export function parseTransactionCommand(message: string): TransactionRequest | null {
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();

  // Match various transaction patterns
  const patterns = [
    // Basic "send X to address" pattern
    /send\s+([\d.]+)\s+(?:eth\s+)?to\s+(0x[a-fA-F0-9]{40})/i,
    // "transfer X ETH to address" pattern
    /transfer\s+([\d.]+)\s+(?:eth\s+)?to\s+(0x[a-fA-F0-9]{40})/i,
    // "send address X ETH" pattern
    /send\s+(0x[a-fA-F0-9]{40})\s+([\d.]+)\s+(?:eth)?/i,
    // Natural language pattern
    /(?:please\s+)?(?:can\s+you\s+)?(?:help\s+me\s+)?send\s+([\d.]+)\s+(?:eth\s+)?to\s+(0x[a-fA-F0-9]{40})/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      // Extract amount and address based on pattern
      const [amount, address] = pattern.toString().includes('send address') 
        ? [match[2], match[1]]  // Pattern where address comes first
        : [match[1], match[2]]; // Standard pattern where amount comes first

      // Convert amount to Wei (assuming ETH input)
      const valueInWei = (parseFloat(amount) * 1e18).toString();

      return {
        to: address,
        value: valueInWei,
        from: '', // This will be filled in by the wallet service
      };
    }
  }

  return null;
} 