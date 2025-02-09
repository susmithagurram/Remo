# Remo AI Assistant
[Chat With Remo](https://remo.gg/) 

built by [Susmitha](https://susmitha.xyz/) & [Suhas](https://suhas.gg/) 

Aditionally you can deploy this using [Autonome](https://dev.autonome.fun/autonome)

Remo is a Personal AI Assistant that can be hired by every human in the planet. Remo helps make users' lives easier through seamless task management, informed recommendations, and efficient problem-solving. A sophisticated personal AI assistant powered by **Privy** for auth and wallet creation, **Viem** for Blockchain interactions on **sepolia** and **Base**, **AWS Bedrock** (Claude 3 Sonnet) with multi-agent collaboration capabilities. 

Nevertheless this is just Version 1.0 project born in Agentic Ethereum 2025 who can make Real time blockchain interactions, Save contacts (Name : Wallet address), Create unlimited wallets, uses AWS Bedrock with Multi-Agent Orchestration and give suggestions for Books and travel using it's Knowledge Base(RAG), can save your tasks/to-do lists. Othe than the webpage user can also integrate Telegram and chat with remo. No need of remembering your keys Remo can now fetch them from AWS dynomoDB easily without revealing them!

Please NOTE: This is version 1.0 there are some areas we need to update it.

**Architecture**
![archetecture](https://github.com/user-attachments/assets/d509ca43-b442-4ebf-9259-2ae7bd3603a8)

The application uses a multi-layered architecture:
1. Typescript, React frontend for user interface
2. AWS Bedrock for AI processing
3. DynamoDB for data persistence
4. Privy for authentication + wallet creation
5. Telegram integration for remote access

### Data Flow
1. User input → Frontend
2. Frontend → Bedrock Service
3. Bedrock Service → Remo → Specialized Agents(Based on service)
4. Agents → DynamoDB (if needed)
5. Response → Frontend
6. Optional: Response → Telegram

Here are some of the favourite prompts of Remo!

1. Create a wallet called pepe
2. Create a contact Vitalik, 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B
3. Select wallet pepe
4. Show all my contacts / tasks
5. Send 0.0001 eth to Vitalik
6. I'm planning to go for a trip with a beach view can you suggest some locations

## Improvements To-Do
Here is our complete RoadMap
1. manage calender (loading 90%..)
2. Meeting Schedules (loading 90%..)
3. Read emails / messages in socials (loading 80%..)
4. Order food through collaboration with resturants
5. Additional specialized agents 
... and more!

## Project Structure
```
remo-ai-assistant/
├── src/
│   ├── agent/
│   │   ├── MultiAgentCollab/
│   │   │   ├── agentOrchestrator.ts
│   │   │   │   └── types.ts
│   │   ├── bedrockService.ts
│   │   ├── config.ts
│   │   └── types.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Chat.tsx
│   │   └── Profile.tsx
│   ├── styles/
│   │   ├── Home.module.css
│   │   ├── Chat.module.css
│   │   └── Profile.module.css
│   ├── utils/
│   │   └── dynamoDBService.ts
│   ├── privy/
│   │   └── PrivyAuth.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
└── package.json
```

## Tech USed

- TypeScript
- React 18
- Vite
- AWS Services:
  - Bedrock (Claude 3 Sonnet)
  - DynamoDB
  - Bedrock Multi Agent Orchestration
  - Knowlegde Base (RAG)
- Privy (Authentication + Wallets)
- Viem (Ethereum interactions)
- Telegram Bot

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/susmithagurram/remo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file using the template in `.env.example`:
```env
# Copy contents from .env.example and fill in your values
```
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_PRIVY_APP_ID | Privy authentication app ID | Yes |
| VITE_AWS_ACCESS_KEY_ID | AWS access key | Yes |
| VITE_AWS_SECRET_ACCESS_KEY | AWS secret key | Yes |
| VITE_AWS_REGION | AWS region (e.g., us-east-1) | Yes |
| VITE_ENCRYPTION_KEY | 32-byte key for encryption | Yes |
| VITE_TELEGRAM_BOT_TOKEN | Telegram bot API token | Yes |
| VITE_JULIET_AGENT_ID | Juliet agent identifier | Yes |
| VITE_BOOK_AGENT_ID | Book agent identifier | Yes |
| VITE_TRAVEL_AGENT_ID | Travel agent identifier | Yes |

4. Set up required services:
   - Create a Privy account and get your app ID
   - Set up AWS credentials with Bedrock and DynamoDB access
   - Create a Telegram bot using BotFather and get the token
   - Generate a 32-byte encryption key to encrypt wallet private keys
   - Create Juliet, Books, Travel agents using in AWS Bedrock >> Builder Tools >> Agents (Refer CreateBedrockAgents.md guide for more details)

5. Start the development server:
```bash
npm run dev
```

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Security

- All sensitive data is encrypted using AES-GCM
- Environment variables for secure configuration
- Privy authentication for user management
- AWS IAM roles for service access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support, please [create an issue](https://github.com/susmithagurram/remo/issues) or contact the maintainers.
