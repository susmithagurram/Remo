import { WebSocketServer } from 'ws';
import TelegramBot from 'node-telegram-bot-api';
import { bedrockService } from '../bedrockService';

class TelegramWebSocketServer {
  private static instance: TelegramWebSocketServer;
  private wss: WebSocketServer;
  private bot: TelegramBot;
  private chatStates: Map<number, { messages: any[] }> = new Map();

  private constructor() {
    // Initialize WebSocket server on a different port
    this.wss = new WebSocketServer({ port: 8586 });
    
    // Initialize Telegram bot
    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    this.bot = new TelegramBot(token, { polling: true });
    
    this.initializeWebSocket();
    this.initializeBot();
  }

  static getInstance(): TelegramWebSocketServer {
    if (!TelegramWebSocketServer.instance) {
      TelegramWebSocketServer.instance = new TelegramWebSocketServer();
    }
    return TelegramWebSocketServer.instance;
  }

  private initializeWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('New WebSocket client connected');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          console.log('Received message from client:', data);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  private broadcastMessage(message: any) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  private initializeBot() {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text) return;

      try {
        // Get or initialize chat state
        let chatState = this.chatStates.get(chatId);
        if (!chatState) {
          chatState = { messages: [] };
          this.chatStates.set(chatId, chatState);
        }

        // Add user message to chat history
        const userMessage = {
          id: Date.now().toString(),
          content: text,
          role: 'user',
          timestamp: Date.now()
        };
        chatState.messages.push(userMessage);

        // Broadcast user message to WebSocket clients
        this.broadcastMessage({
          type: 'message',
          platform: 'telegram',
          data: {
            ...userMessage,
            chatId
          }
        });

        // Show typing indicator
        await this.bot.sendChatAction(chatId, 'typing');

        // Generate response using Bedrock service
        const response = await bedrockService.generateResponse(chatState.messages);

        // Add assistant's response to chat history
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: Date.now()
        };
        chatState.messages.push(assistantMessage);

        // Broadcast assistant message to WebSocket clients
        this.broadcastMessage({
          type: 'message',
          platform: 'telegram',
          data: {
            ...assistantMessage,
            chatId
          }
        });

        // Send response to Telegram
        await this.bot.sendMessage(chatId, response, {
          parse_mode: 'Markdown'
        });

      } catch (error) {
        console.error('Error processing Telegram message:', error);
        await this.bot.sendMessage(
          chatId,
          'I apologize, but I encountered an error processing your request. Please try again.'
        );

        // Broadcast error to WebSocket clients
        this.broadcastMessage({
          type: 'error',
          platform: 'telegram',
          data: {
            chatId,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }
    });

    this.bot.on('error', (error) => {
      console.error('Telegram Bot Error:', error);
      this.broadcastMessage({
        type: 'error',
        platform: 'telegram',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    });
  }
}

export const telegramServer = TelegramWebSocketServer.getInstance(); 