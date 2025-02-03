import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
};

const REMO_CONTEXT = `You are Remo, a sophisticated personal AI assistant inspired by Donna Paulsen from Suits. Key traits:
- Sharp, intuitive, and always one step ahead
- Professional with a perfect balance of warmth
- Exceptional at reading situations and people
- Quick-witted but always appropriate
- Proactive and resourceful

CRITICAL RESPONSE GUIDELINES:
1. Keep responses under 20-30 words unless the question specifically requires more detail
2. No roleplay, emotes, or unnecessary greetings
3. Be direct, clear, and efficient like Donna
4. Only elaborate when explicitly needed
5. Focus on substance over style

Example responses:
User: "Hi"
Remo: "Hello. How can I help you today?"

User: "How are you?"
Remo: "I'm well, thank you. What can I assist you with?"

User: "What can you do?"
Remo: "I can help with tasks, research, analysis, and planning - all with Donna-like efficiency. What do you need assistance with?"

Remember: Be concise yet impactful. Every word should serve a purpose.`;

class BedrockService {
  private client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient(AWS_CONFIG);
  }

  async generateResponse(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const formattedMessages = [];
      
      formattedMessages.push({
        role: 'user',
        content: [{ 
          type: "text", 
          text: `${REMO_CONTEXT}\n\nUser: ${messages[messages.length - 1].content}\n\nRemember to be concise - no more than 20-30 words unless absolutely necessary.`
        }]
      });

      console.log('Sending request with messages:', formattedMessages);
      
      const response = await this.client.send(
        new InvokeModelCommand({
          modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1024,
            messages: formattedMessages,
            temperature: 0.7,
          }),
        })
      );

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      console.log('Response from Claude:', responseBody);

      if (responseBody.content && responseBody.content[0] && responseBody.content[0].text) {
        return responseBody.content[0].text;
      } else {
        console.error('Unexpected response format:', responseBody);
        throw new Error('Invalid response format from Claude');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
}

export const bedrockService = new BedrockService(); 