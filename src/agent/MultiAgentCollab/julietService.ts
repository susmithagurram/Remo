import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { JulietResponse } from './types';

class JulietService {
  private static instance: JulietService;
  private client: BedrockRuntimeClient;
  private bookAgentId: string = import.meta.env.VITE_BOOK_AGENT_ID;
  private travelAgentId: string = import.meta.env.VITE_TRAVEL_AGENT_ID;

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
          prompt: `\n\nHuman: You are Remo's specialized book recommendation agent (ID: ${this.bookAgentId}). 
As part of Remo's multi-agent system, you provide expert literary guidance and personalized book recommendations.
Based on the query: "${query}", provide thoughtful recommendations with:
- Title, author, and format options
- Brief but engaging descriptions
- Ratings and key highlights
- Why this book might resonate with the user

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
          prompt: `\n\nHuman: You are Remo's specialized travel planning agent (ID: ${this.travelAgentId}).
As part of Remo's multi-agent system, you provide expert travel guidance and personalized recommendations.
Based on the query: "${query}", create a comprehensive travel plan including:
- Curated destination recommendations
- Engaging activities and experiences
- Optimal visit timing and seasonal considerations
- Essential packing suggestions
- Practical travel tips

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
}

export const julietService = JulietService.getInstance(); 