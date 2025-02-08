import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { Message } from './types';
import { Contact } from './viem/types';
import { parseTransactionCommand } from './viem/transactionParser';
import { walletService } from './viem/walletService';
import { contactsService } from './contacts/contactsService';
import { dynamoDBService } from '../utils/dynamoDBService';
import { tasksService } from './tasks/tasksService';
import { agentOrchestrator } from './MultiAgentCollab/agentOrchestrator';

class BedrockService {
  private client: BedrockRuntimeClient;
  private userId: string | null = null;
  private pendingTransaction: any = null;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  setUserId(userId: string) {
    console.log('Setting bedrockService userId:', userId);
    this.userId = userId;
  }

  async generateResponse(messages: Message[]): Promise<string> {
    try {
      const lastMessage = messages[messages.length - 1];
      
      // Check for task-related commands first
      if (lastMessage.content.toLowerCase().includes('task') || 
          lastMessage.content.toLowerCase().includes('to do')) {
        const taskResponse = await this.handleTaskCommand(lastMessage.content);
        if (taskResponse) return taskResponse;
      }

      console.log('Processing message:', lastMessage.content);

      // Check if the query should be routed to Juliet
      if (this.shouldRouteToJuliet(lastMessage.content)) {
        try {
          console.log('Routing to Juliet:', lastMessage.content);
          const response = await agentOrchestrator.routeRequest(lastMessage.content);
          console.log('Juliet response:', response);
          
          // Process Markdown formatting
          const formattedResponse = response.response
            .replace(/```/g, '') // Remove backticks
            .replace(/\n\n+/g, '\n\n') // Normalize multiple newlines to double newlines
            .trim(); // Remove extra whitespace
          
          return formattedResponse;
        } catch (error) {
          console.error('Detailed Juliet routing error:', {
            error,
            stack: error instanceof Error ? error.stack : undefined,
            message: error instanceof Error ? error.message : 'Unknown error'
          });
          return "I encountered an error processing your request through our specialized agents. Let me help you directly instead.";
        }
      }

      if (lastMessage.role === 'user') {
        // Check for send ETH to contact request
        const sendRequest = lastMessage.content.toLowerCase()
          .match(/(?:can you |please |)(?:send|transfer)\s*([\d.]+)\s*(?:eth|ether|)\s*(?:to|for)\s+(?:contact |my contact |)([a-zA-Z0-9]+)/i);

        if (sendRequest) {
          console.log('Send request matched:', sendRequest);
          const [_, amount, contactName] = sendRequest;
          console.log('Parsed send request:', { amount, contactName });

          if (!this.userId) {
            return "I need you to connect your wallet first to send ETH.";
          }

          try {
            // Find the contact
            const contact = await contactsService.findContactByName(this.userId, contactName);
            if (!contact) {
              return `I couldn't find a contact named "${contactName}". Please check the name and try again.`;
            }

            // Get selected wallet
            const selectedWallet = walletService.getSelectedWallet();
            if (!selectedWallet) {
              return "Please select a wallet in your profile first to send ETH.";
            }

            // Create transaction request
            const txRequest = {
              from: selectedWallet.address,
              to: contact.walletAddress,
              value: (parseFloat(amount) * 1e18).toString(),
            };

            // Store the transaction request for later use
            this.pendingTransaction = txRequest;

            // Ask for confirmation
            return `I found ${contactName}'s wallet address (${contact.walletAddress}). Would you like me to send ${amount} ETH from your wallet (${selectedWallet.address})? Please confirm with "yes" or "confirm".`;
          } catch (error) {
            console.error('Error processing send request:', error);
            return "I had trouble processing your request. Please try again later.";
          }
        }

        // Check for confirmation
        const confirmRequest = lastMessage.content.toLowerCase().match(/^(?:yes|confirm|proceed)$/);
        if (confirmRequest && messages.length >= 2) {
          const previousMessage = messages[messages.length - 2];
          if (previousMessage.role === 'assistant' && previousMessage.content.includes('Would you like me to send')) {
            try {
              if (!this.pendingTransaction) {
                return "I couldn't find the transaction details. Please start over.";
              }

              const selectedWallet = walletService.getSelectedWallet();
              if (!selectedWallet) {
                return "The wallet is no longer selected. Please try again.";
              }

              const tx = await walletService.sendTransaction(this.pendingTransaction);
              this.pendingTransaction = null; // Clear after use

              return `Transaction sent! You can track it here: https://sepolia.etherscan.io/tx/${tx.hash}`;
            } catch (error: any) {
              console.error('Error sending transaction:', error);
              if (error.message.includes('insufficient funds')) {
                return "You don't have enough ETH in your wallet for this transaction. Please check your balance and try again.";
              }
              return `Failed to send transaction: ${error.message}`;
            }
          }
        }

        // Check for save contact request
        const saveRequest = lastMessage.content.toLowerCase()
          .match(/(?:can you |please |)(?:save|add|create)\s*(?:the |a |)(?:new |)contact(?:s|)\s*(?:with |named |name:|for |)\s*([a-zA-Z0-9]+)\s*(?:,|\s)\s*(?:wallet:|address:|with address:|with wallet:|\s)\s*(0x[a-fA-F0-9]{40})/i);

        console.log('Save request match result:', saveRequest);

        if (saveRequest) {
          console.log('Save request matched:', saveRequest);
          const [fullMatch, name, address] = saveRequest;
          console.log('Parsed save request:', { fullMatch, name, address });
          
          if (!this.userId) {
            console.log('No userId found for saving contact');
            return "I need you to connect your wallet first to save contacts.";
          }

          try {
            console.log('Starting contact save process for userId:', this.userId);
            const timestamp = Date.now();
            const contact: Contact = {
              id: `${timestamp}`,
              contactId: `${timestamp}`,
              userId: this.userId,
              name: name.trim(),
              walletAddress: address.trim(),
              createdAt: timestamp,
              updatedAt: timestamp,
            };
            console.log('Created contact object:', contact);

            console.log('Checking for existing contact...');
            await contactsService.loadUserContacts(this.userId);
            const existingContact = await contactsService.findContactByName(this.userId, name);
            console.log('Existing contact check result:', existingContact);

            if (existingContact) {
              console.log('Found existing contact with same name');
              return `A contact named "${name}" already exists. Please use a different name.`;
            }

            console.log('Attempting to save contact to DynamoDB...');
            await dynamoDBService.saveContact(contact);
            console.log('Successfully saved contact to DynamoDB');
            
            // Reload contacts to verify save
            await contactsService.loadUserContacts(this.userId);
            const verifyContact = await contactsService.findContactByName(this.userId, name);
            console.log('Verification of saved contact:', verifyContact);

            return `I've saved ${name} to your contacts with address ${address}`;
          } catch (error) {
            console.error('Error in save contact process:', error);
            return "I had trouble saving the contact. Please try again later.";
          }
        }

        // Check for contact address request
        const addressRequest = lastMessage.content.toLowerCase()
          .match(/(?:what(?:'s| is)|get|show|tell me|find)?\s*(?:the\s+)?(?:wallet\s+)?address(?:\s+of|\s+for|\s+)?\s*([a-zA-Z0-9\s]+)/i);
        
        if (addressRequest) {
          const contactName = addressRequest[1];
          console.log('Current bedrockService userId:', this.userId);
          if (!this.userId) {
            return "I'm having trouble accessing your contacts. Please try again in a moment.";
          }

          try {
            console.log('Looking up contact:', contactName, 'for userId:', this.userId);
            const contact = await contactsService.findContactByName(this.userId, contactName);
            console.log('Found contact:', contact);
            if (contact) {
              return `The wallet address for ${contact.name} is: ${contact.walletAddress}`;
            } else {
              return `I couldn't find a contact named "${contactName}" in your contacts. You can add them in your profile under the Contacts section.`;
            }
          } catch (error) {
            console.error('Error looking up contact:', error);
            return "I had trouble accessing your contacts. Please try again later.";
          }
        }

        // Handle Remo wallet-specific requests
        const walletRequest = lastMessage.content.toLowerCase().match(/(?:what'?s|what is|share|tell me|show|get) (?:your|the|my|current|selected) (?:wallet )?address/);
        if (walletRequest) {
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
            return "I apologize, but I need you to connect your wallet first to help you with transactions. Would you like me to guide you through that process?";
          }

          txRequest.from = selectedWallet.address;
          try {
            const tx = await walletService.sendTransaction(txRequest);
            return `💫 Transaction Initiated Successfully!
──────────────────────────────────

📊 Transaction Details
───────────────────
• Network: Sepolia Testnet
• Status: Pending Confirmation
• Amount: ${(parseInt(tx.value) / 1e18).toFixed(4)} ETH

👤 From Wallet
───────────────
${tx.from}

👥 To Address
───────────────
${tx.to}

🔗 Transaction Hash
───────────────────
${tx.hash}

🌐 Track Your Transaction
────────────────────────
View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}

ℹ️ Next Steps
────────────
• Your transaction has been submitted to the network
• Confirmation typically takes 2-5 minutes
• You'll be able to view the transaction status on Etherscan

Need help? Just ask me to:
• Check transaction status
• Explain any error messages
• Help with future transactions`;

          } catch (error: any) {
            if (error.message.includes('Insufficient balance')) {
              return `❌ Transaction Failed: Insufficient Balance

💡 How to Get Test ETH
──────────────────────
You can get free test ETH from these Sepolia faucets:

1️⃣ Alchemy Faucet
   • Visit: https://sepoliafaucet.com
   • Connect your wallet
   • Request test ETH

2️⃣ Infura Faucet
   • Visit: https://www.infura.io/faucet/sepolia
   • Follow the instructions
   • Receive test ETH

Need help? I can guide you through:
• Using the faucets
• Checking your balance
• Setting up your wallet correctly

Would you like me to walk you through getting test ETH?`;

            } else if (error.message.includes('gas')) {
              return `⚠️ Transaction Failed: Gas Estimation Error
──────────────────────────────────────

Possible Reasons:
1. Network congestion
2. Complex contract interaction
3. Recipient contract rejecting the transaction

💡 Suggested Solutions:
• Try again with a higher gas limit
• Wait for network congestion to decrease
• Verify the recipient address is correct

Would you like to:
• Retry with adjusted gas settings?
• Check network status?
• Verify the recipient address?`;

            } else {
              return `❌ Transaction Failed
────────────────────

Error Message: ${error.message}

🔍 Troubleshooting Checklist:
1. Sufficient Balance
   • Current balance: [Will check if requested]
   • Required amount: ${(parseInt(txRequest.value) / 1e18).toFixed(4)} ETH

2. Network Status
   • Sepolia Testnet
   • Check for any known issues

3. Address Verification
   • Confirm recipient address is correct
   • Verify address format

Would you like me to help:
• Check your current balance
• Verify the recipient address
• Troubleshoot specific issues
• Try the transaction again`;
            }
          }
        }

        // Check for task creation
        const createTaskRequest = lastMessage.content.toLowerCase()
          .match(/(?:create|add|make)\s+(?:a\s+)?(?:new\s+)?task(?:\s+to\s+do)?[:\s]+(.+)/i);

        if (createTaskRequest) {
          const [_, taskTitle] = createTaskRequest;
          if (!this.userId) {
            return "I apologize, but I need you to connect your wallet first to help manage your tasks. Would you like me to help you get set up?";
          }

          try {
            const task = await tasksService.createTask(this.userId, taskTitle.trim());
            return `I've created a new task: "${task.title}"`;
          } catch (error) {
            console.error('Error creating task:', error);
            return "I encountered a temporary issue processing your request through our specialized agents. I'm happy to help you directly or we can try your request again.";
          }
        }

        // Check for task completion
        const completeTaskRequest = lastMessage.content.toLowerCase()
          .match(/(?:complete|finish|mark done|mark completed)\s+task[:\s]+(.+)/i);

        if (completeTaskRequest) {
          const [_, taskTitle] = completeTaskRequest;
          if (!this.userId) {
            return "I couldn't find a task with that title. Would you like to see a list of your current tasks?";
          }

          try {
            const tasks = await tasksService.listTasks(this.userId);
            const task = tasks.find(t => t.title.toLowerCase() === taskTitle.trim().toLowerCase());
            if (!task) {
              return `I couldn't find a task titled "${taskTitle}". Please check the title and try again.`;
            }

            await tasksService.updateTask(this.userId, task.id, { status: 'completed' });
            return `I've marked the task "${task.title}" as completed!`;
          } catch (error) {
            console.error('Error completing task:', error);
            return "I encountered a temporary issue processing your request through our specialized agents. I'm happy to help you directly or we can try your request again.";
          }
        }

        // Check for task list request
        const listTasksRequest = lastMessage.content.toLowerCase()
          .match(/(?:show|list|display|get|what are)\s+(?:my\s+)?(?:pending\s+)?tasks/i);

        if (listTasksRequest) {
          if (!this.userId) {
            return "I need you to connect your wallet first to view tasks.";
          }

          try {
            const tasks = await tasksService.listTasks(this.userId);
            if (tasks.length === 0) {
              return "You don't have any tasks yet. Would you like to create one?";
            }

            const pendingTasks = tasks.filter(t => t.status === 'pending');
            const completedTasks = tasks.filter(t => t.status === 'completed');

            let response = "Here are your tasks:\n\n";
            if (pendingTasks.length > 0) {
              response += "📝 Pending Tasks:\n" + pendingTasks.map(t => `- ${t.title}`).join('\n') + '\n\n';
            }
            if (completedTasks.length > 0) {
              response += "✅ Completed Tasks:\n" + completedTasks.map(t => `- ${t.title}`).join('\n');
            }

            return response;
          } catch (error) {
            console.error('Error listing tasks:', error);
            return "I encountered a temporary issue processing your request through our specialized agents. I'm happy to help you directly or we can try your request again.";
          }
        }
      }

      // For non-transaction messages, let's make Remo more helpful with wallet-related tasks
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: `\n\nHuman: You are Remo, an advanced personal AI assistant capable of handling multiple tasks including:
- Book recommendations and literary guidance through specialized agents
- Travel planning and destination advice
- Blockchain transactions and wallet management on Sepolia testnet
- Task and contact management
- And more evolving capabilities

Your mission is to make users' lives easier through seamless task management, informed recommendations, and efficient problem-solving. Be proactive, professional yet warm, and always prioritize user needs.

Current conversation:
${this.formatMessages(messages)}\n\nAssistant:`,
          max_tokens_to_sample: 2000,
          temperature: 0.7,
        }),
      });

      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      const parsedResponse = JSON.parse(responseBody);
      
      return parsedResponse.completion;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  private formatMessages(messages: Message[]): string {
    const formattedMessages = messages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    return `${formattedMessages}\n\nAssistant:`;
  }

  private shouldRouteToJuliet(query: string): boolean {
    const julietKeywords = [
      'book', 'read', 'author', 'kindle', 'audible',
      'travel', 'destination', 'trip', 'visit', 'explore'
    ];
    
    return julietKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private async handleTaskCommand(text: string): Promise<string> {
    if (!this.userId) {
      return "Please connect your wallet first to manage tasks.";
    }

    // Show tasks command
    if (text.match(/show\s+(all\s+)?tasks|show\s+to\s*do'?s|list\s+tasks/i)) {
      try {
        const tasks = await tasksService.listTasks(this.userId);
        
        if (tasks.length === 0) {
          return "You don't have any tasks yet. Would you like to create one? Just say something like 'add task: buy groceries'";
        }

        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const completedTasks = tasks.filter(t => t.status === 'completed');

        let response = "Here are your tasks:\n\n";
        
        if (pendingTasks.length > 0) {
          response += "📝 Pending Tasks:\n" + 
            pendingTasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n') + '\n\n';
        }
        
        if (completedTasks.length > 0) {
          response += "✅ Completed Tasks:\n" + 
            completedTasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n');
        }

        response += "\n\nYou can add new tasks by saying 'add task: [task description]' or mark tasks as complete by saying 'complete task [number]'.";
        
        return response;
      } catch (error) {
        console.error('Error listing tasks:', error);
        return "I encountered an error retrieving your tasks. Please try again.";
      }
    }

    // Add this return statement at the end
    return "I can help you manage tasks. Try saying 'show tasks', 'add task: [description]', or 'complete task [number]'.";
  }
}

export const bedrockService = new BedrockService(); 