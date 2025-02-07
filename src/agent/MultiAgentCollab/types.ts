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

export interface BookRecommendation {
  title: string;
  author: string;
  isbn: string;
  rating: number;
  description: string;
  format: 'Kindle' | 'Audible' | 'Paperback';
  price?: number;
  link?: string;
}

export interface TravelRecommendation {
  destination: string;
  description: string;
  activities: string[];
  bestTimeToVisit: string;
  estimatedBudget: {
    min: number;
    max: number;
    currency: string;
  };
  packingList?: string[];
  amazonExploreLink?: string;
} 