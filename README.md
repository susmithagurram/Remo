# Remo AI Assistant

A sophisticated personal AI assistant powered by AWS Bedrock (Claude 3 Sonnet) with multi-agent collaboration capabilities. Remo helps make users' lives easier through seamless task management, informed recommendations, and efficient problem-solving.

## Features
![archetecture](https://github.com/user-attachments/assets/d509ca43-b442-4ebf-9259-2ae7bd3603a8)

### Core Capabilities
- Natural language task management
- Multi-agent collaboration system
- Real-time chat interface
- Secure authentication with Privy
- AWS Bedrock integration
- DynamoDB for data persistence
- Telegram bot integration

### Task Management
- Create and manage to-do lists
- Mark tasks as complete
- View pending and completed tasks
- Natural language task creation

### Specialized Agents
- **Juliet** (Orchestrator Agent)
  - Coordinates between specialized agents
  - Routes queries to appropriate agents
  - Ensures cohesive responses

- **Book Agent**
  - Literary recommendations
  - Format and pricing options
  - Personalized book suggestions

- **Travel Agent**
  - Destination planning
  - Activity recommendations
  - Travel timing and packing advice

### Additional Features
- Blockchain transaction management (Sepolia testnet)
- Contact management system
- Secure wallet management
- Telegram bot integration for remote access

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

## Tech Stack

- React 18
- TypeScript
- Vite
- AWS Services:
  - Bedrock (Claude 3 Sonnet)
  - DynamoDB
- Privy Authentication
- Viem (Ethereum interactions)
- Telegram Bot API
- WebSocket for real-time updates

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file using the template in `.env.example`:
```env
# Copy contents from .env.example and fill in your values
```

4. Set up required services:
   - Create a Privy account and get your app ID
   - Set up AWS credentials with Bedrock and DynamoDB access
   - Create a Telegram bot using BotFather and get the token
   - Generate a 32-byte encryption key

5. Start the development server:
```bash
npm run dev
```

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Environment Variables

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

## Architecture

The application uses a multi-layered architecture:
1. React frontend for user interface
2. AWS Bedrock for AI processing
3. DynamoDB for data persistence
4. Privy for authentication
5. Telegram integration for remote access
6. WebSocket for real-time updates

### Data Flow
1. User input → Frontend
2. Frontend → Bedrock Service
3. Bedrock Service → Specialized Agents
4. Agents → DynamoDB (if needed)
5. Response → Frontend
6. Optional: Response → Telegram

## Security

- All sensitive data is encrypted using AES-GCM
- Environment variables for secure configuration
- Privy authentication for user management
- AWS IAM roles for service access
- Secure WebSocket connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License] - See LICENSE file for details

## Support

For support, please [create an issue](your-repo-url/issues) or contact the maintainers.

## Future Enhancements

- Enhanced knowledge base integration
- Advanced document analysis
- Calendar management
- Email composition assistance
- Meeting scheduling
- Project management tools
- Additional specialized agents 
