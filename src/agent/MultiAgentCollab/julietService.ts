import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { JulietResponse, BookRecommendation, TravelRecommendation } from './types';

class JulietService {
  private static instance: JulietService;
  private client: BedrockRuntimeClient;
  private agentId: string = 'H0VMTFIK5P'; // Juliet's actual ID
  private bookAgentId: string = 'BYSIK6CAIA';
  private travelAgentId: string = '2DPENANVVK';

  private constructor() {
    this.client = new BedrockRuntimeClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  static getInstance(): JulietService {
    if (!JulietService.instance) {
      JulietService.instance = new JulietService();
    }
    return JulietService.instance;
  }

  async processBookRequest(query: string): Promise<JulietResponse> {
    try {
      console.log('Processing book request:', query);
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: `\n\nHuman: You are a book recommendation specialist agent (ID: ${this.bookAgentId}). 
                  Based on the query: "${query}", provide relevant book recommendations.
                  Include details about format, ratings, and brief descriptions.
                  Format your response in a clear, structured way.\n\nAssistant:`,
          max_tokens_to_sample: 2000,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      console.log('Sending command to Bedrock');
      const response = await this.client.send(command);
      console.log('Received response from Bedrock');
      
      const responseBody = new TextDecoder().decode(response.body);
      console.log('Decoded response body:', responseBody);
      
      const result = JSON.parse(responseBody);
      console.log('Parsed result:', result);

      return {
        source: 'books',
        content: result.completion,
        metadata: {
          agentId: this.bookAgentId,
          query
        }
      };
    } catch (error) {
      console.error('Detailed error in processBookRequest:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : 'Unknown error',
        query
      });
      throw error;
    }
  }

  async processTravelRequest(query: string): Promise<JulietResponse> {
    try {
      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-v2',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: `\n\nHuman: You are a travel planning specialist agent (ID: ${this.travelAgentId}).
                  Based on the query: "${query}", provide travel recommendations including:
                  - Destinations
                  - Activities
                  - Best times to visit
                  - Packing suggestions
                  Format your response in a clear, structured way.\n\nAssistant:`,
          max_tokens_to_sample: 2000,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      const result = JSON.parse(responseBody);

      return {
        source: 'travel',
        content: result.completion,
        metadata: {
          agentId: this.travelAgentId,
          query
        }
      };
    } catch (error) {
      console.error('Error processing travel request:', error);
      throw error;
    }
  }

  private parseBookRecommendations(content: string): BookRecommendation[] {
    // Implement parsing logic for book recommendations
    // This is a placeholder implementation
    return [];
  }

  private parseTravelRecommendations(content: string): TravelRecommendation[] {
    // Implement parsing logic for travel recommendations
    // This is a placeholder implementation
    return [];
  }
}

export const julietService = JulietService.getInstance(); 