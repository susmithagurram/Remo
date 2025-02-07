export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: number;
  preview: string;
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
  capabilities: {
    current: string[];
    upcoming: string[];
  };
  principles: string[];
  mission: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  createdAt: number;
  updatedAt: number;
} 