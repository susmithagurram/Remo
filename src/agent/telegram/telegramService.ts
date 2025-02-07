import { bedrockService } from '../bedrockService';

class TelegramService {
  private static instance: TelegramService;
  private chatStates: Map<number, { messages: any[] }> = new Map();
  private token: string;
  private baseUrl: string;

  private constructor() {
    this.token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    this.startPolling();
  }

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  private async startPolling() {
    console.log('Starting Telegram polling...');
    let offset = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${this.baseUrl}/getUpdates?offset=${offset}&timeout=30`);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            offset = update.update_id + 1;
            if (update.message?.text) {
              await this.handleMessage(update.message);
            }
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }

      // Continue polling
      setTimeout(poll, 1000);
    };

    poll();
  }

  private async handleMessage(msg: any) {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log('Received message:', { chatId, text });

    try {
      // Get or initialize chat state
      let chatState = this.chatStates.get(chatId);
      if (!chatState) {
        chatState = { messages: [] };
        this.chatStates.set(chatId, chatState);
      }

      // Add user message to chat history
      chatState.messages.push({
        id: Date.now().toString(),
        content: text,
        role: 'user',
        timestamp: Date.now()
      });

      // Show typing indicator
      await this.sendChatAction(chatId, 'typing');

      // Generate response using Bedrock service
      const response = await bedrockService.generateResponse(chatState.messages);

      // Add assistant's response to chat history
      chatState.messages.push({
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now()
      });

      // Send response
      await this.sendMessage(chatId, response);

    } catch (error) {
      console.error('Error processing message:', error);
      await this.sendMessage(
        chatId,
        'I apologize, but I encountered an error processing your request. Please try again.'
      );
    }
  }

  private async sendMessage(chatId: number, text: string) {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private async sendChatAction(chatId: number, action: string) {
    try {
      await fetch(`${this.baseUrl}/sendChatAction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          action: action,
        }),
      });
    } catch (error) {
      console.error('Error sending chat action:', error);
    }
  }
}

export const telegramService = TelegramService.getInstance(); 