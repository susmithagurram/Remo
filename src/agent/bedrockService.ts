import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Message } from './types';
import { parseTransactionCommand } from './agentkit/transactionParser';
import { walletService } from './agentkit/walletService';

class BedrockService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      // Check if the last message is a transaction request
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        // Check for wallet address request
        const addressRequest = lastMessage.content.toLowerCase().match(/(?:what'?s|what is|share|tell me|show|get) (?:your|the|my|current|selected) (?:wallet )?address/);
        if (addressRequest) {
          const selectedWallet = walletService.getSelectedWallet();
          if (!selectedWallet) {
            return "I don't have a selected wallet yet. Please go to your profile and select a wallet first.";
          }
          return `My currently selected wallet address is: ${selectedWallet.address}\n\nYou can copy this address or find it in your profile under Remo Wallets.`;
        }

        // Handle transaction request
        const txRequest = parseTransactionCommand(lastMessage.content);
        if (txRequest) {
          const selectedWallet = walletService.getSelectedWallet();
          if (!selectedWallet) {
            return "I notice you want to make a transaction, but you haven't selected a wallet yet. Please go to your profile, create a Remo wallet if you haven't already, and select it for use. Once you've done that, I'll be able to help you send transactions on Sepolia testnet.";
          }

          txRequest.from = selectedWallet.address;
          try {
            const tx = await walletService.sendTransaction(txRequest);
            return `I've successfully initiated the transaction on Sepolia testnet!\n\nTransaction Details:\nFrom: ${tx.from}\nTo: ${tx.to}\nAmount: ${(parseInt(tx.value) / 1e18).toFixed(4)} ETH\nTransaction Hash: ${tx.hash}\n\nYou can track your transaction at https://sepolia.etherscan.io/tx/${tx.hash}\n\nThe transaction has been submitted to the network and is being processed. It may take a few minutes to be confirmed.`;
          } catch (error: any) {
            if (error.message.includes('Insufficient balance')) {
              return `${error.message}\n\nTo get test ETH for your wallet, you can use these Sepolia faucets:\n1. Alchemy Faucet: https://sepoliafaucet.com\n2. Infura Faucet: https://www.infura.io/faucet/sepolia\n\nWould you like me to guide you through getting test ETH?`;
            } else if (error.message.includes('gas')) {
              return "The transaction failed due to gas estimation issues. This usually means either:\n1. The network is congested\n2. The recipient address might be a contract that's rejecting the transaction\n\nWould you like to try again with a higher gas limit?";
            } else {
              return `The transaction failed: ${error.message}\n\nPlease verify:\n1. You have enough Sepolia ETH for the transaction and gas fees\n2. The recipient address is correct\n3. The network is functioning properly\n\nWould you like me to help troubleshoot?`;
            }
          }
        }
      }

      // For non-transaction messages, let's make Remo more helpful with wallet-related tasks
      const prompt = `You are Remo, a personal AI assistant who can help with blockchain transactions and wallet management on the Sepolia testnet. You can help users send transactions, check balances, and manage their wallets. You should be proactive in helping users get test ETH when needed and guide them through the process of using the Sepolia testnet.

Current conversation:
${this.formatMessages(messages)}`;
      
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
          max_tokens_to_sample: 2000,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      const parsedResponse = JSON.parse(responseBody);
      
      return parsedResponse.completion;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  private formatMessages(messages: Message[]): string {
    return messages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
  }
}

export const bedrockService = new BedrockService(); 