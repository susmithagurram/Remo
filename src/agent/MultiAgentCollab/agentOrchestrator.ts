import { julietService } from './julietService';
import { AgentResponse, JulietResponse } from './types';

class AgentOrchestrator {
  private static instance: AgentOrchestrator;

  private constructor() {}

  static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  async routeRequest(query: string): Promise<AgentResponse> {
    try {
      // Analyze query to determine the appropriate agent
      const queryType = this.analyzeQuery(query);
      let response: JulietResponse;

      switch (queryType) {
        case 'books':
          response = await julietService.processBookRequest(query);
          break;
        case 'travel':
          response = await julietService.processTravelRequest(query);
          break;
        default:
          throw new Error('Unable to determine query type');
      }

      return {
        agentId: 'juliet',
        response: this.formatResponse(response),
        timestamp: Date.now(),
        metadata: response.metadata
      };
    } catch (error) {
      console.error('Error routing request:', error);
      throw error;
    }
  }

  private analyzeQuery(query: string): 'books' | 'travel' | 'unknown' {
    const bookKeywords = ['book', 'read', 'author', 'kindle', 'audible', 'literature'];
    const travelKeywords = ['travel', 'destination', 'trip', 'visit', 'explore', 'adventure'];

    query = query.toLowerCase();

    if (bookKeywords.some(keyword => query.includes(keyword))) {
      return 'books';
    }

    if (travelKeywords.some(keyword => query.includes(keyword))) {
      return 'travel';
    }

    return 'unknown';
  }

  private formatResponse(response: JulietResponse): string {
    if (response.source === 'books') {
      return `📚 Book Recommendations from BookAgent:\n\n${response.content}\n\n` +
             `Feel free to ask for more specific book recommendations!`;
    } else {
      return `✈️ Travel Recommendations from TravelAgent:\n\n${response.content}\n\n` +
             `Let me know if you'd like more details about any destination!`;
    }
  }
}

export const agentOrchestrator = AgentOrchestrator.getInstance(); 