import { bedrockService } from '../bedrockService';

// Mock TelegramBot type for client-side
interface Message {
  chat: { id: number };
  text?: string;
}

class TelegramService {
  private static instance: TelegramService;
  private chatStates: Map<number, { messages: any[] }> = new Map();
  private isInitialized = false;

  private constructor() {}

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  // This is just a stub for client-side
  initialize() {
    if (this.isInitialized) {
      return;
    }

    console.log('Telegram service is disabled in browser environment');
    this.isInitialized = true;
  }

  // Method for client to check status
  isEnabled(): boolean {
    return false; // Always false in browser
  }
}

export const telegramService = TelegramService.getInstance(); 