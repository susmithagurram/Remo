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

Based on the query: "${query}", I'll recommend some carefully selected books.

Use this EXACT format for each recommendation:

\`\`\`
2. "Sapiens: A Brief History of Humankind" by Yuval Noah Harari

Rating: 4.5/5 (Goodreads)

What it's about:
Harari offers an exploration of the history of human beings, starting from the earliest ancestors of Homo sapiens to the present day. It discusses key turning points in human evolution, such as the Cognitive Revolution, Agricultural Revolution, and Scientific Revolution, along with the development of society, culture, and technology.

Why it's worth reading:
If you're curious about human history, society, and the impact of our species on the world, Sapiens is an intellectually stimulating read. Harari's ability to simplify complex ideas and engage readers with thought-provoking questions about our future makes this a must-read for history enthusiasts.

Available Formats:
• Hardcover
• Paperback
• E-book
• Audiobook

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

Critical Formatting Rules:
1. Start each book with a triple backtick (\`\`\`)
2. End each book with a triple backtick (\`\`\`)
3. Use double newlines between sections
4. Keep each section header on its own line
5. Use bullet points for formats
6. Include the divider line
7. Keep paragraphs as single blocks
8. Maintain consistent indentation
9. Number each book
10. Include Goodreads rating

Follow this EXACT format for 2-3 book recommendations, preserving all spacing and formatting.\n\nAssistant:`,
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

Based on the query: "${query}", create a comprehensive travel plan using the following structure:

🌍 DESTINATION OVERVIEW
───────────────────────
Best Time to Visit: [Specify seasons/months]
Duration: [Recommended trip length]
Budget Range: [Budget category and estimated costs]

📍 TOP ATTRACTIONS & EXPERIENCES
• [Attraction 1] - [Brief description]
• [Attraction 2] - [Brief description]
• [Attraction 3] - [Brief description]

🏨 ACCOMMODATION OPTIONS
───────────────────────
Luxury: [Suggestion with price range]
Mid-Range: [Suggestion with price range]
Budget: [Suggestion with price range]

📅 SUGGESTED ITINERARY HIGHLIGHTS
Day 1: [Key activities]
Day 2: [Key activities]
Day 3: [Key activities]

🎒 ESSENTIAL PACKING LIST
• [Category 1]: [Items]
• [Category 2]: [Items]
• [Category 3]: [Items]

💡 TRAVEL TIPS
• [Important tip 1]
• [Important tip 2]
• [Important tip 3]

Remember to:
1. Provide specific, actionable recommendations
2. Include practical details (costs, timing, logistics)
3. Consider the traveler's likely preferences based on the query
4. Highlight unique experiences
5. Add local insights when possible

Format your response in a clear, visually appealing way.\n\nAssistant:`,
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