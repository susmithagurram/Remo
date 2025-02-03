export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface RemoPersonality {
  name: string;
  role: string;
  traits: string[];
  introduction: string;
  style: {
    tone: string;
    language: string;
    formality: string;
  };
} 