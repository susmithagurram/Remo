export interface AgentResponse {
  agentId: string;
  response: string;
  timestamp: number;
  metadata?: any;
}

export interface JulietResponse {
  source: 'books' | 'travel';
  content: string;
  recommendations?: any[];
  metadata?: any;
} 