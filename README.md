# Remo AI Assistant

A sophisticated personal AI assistant powered by AWS Bedrock (Claude 3 Sonnet) with multi-agent collaboration capabilities. Remo helps make users' lives easier through seamless task management, informed recommendations, and efficient problem-solving.

## Features

### Core Capabilities
- Multi-agent collaboration system
- Real-time chat interface
- Secure authentication with Privy
- AWS Bedrock integration
- DynamoDB for data persistence

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
- Task tracking and organization
- Secure wallet management

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

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
VITE_AWS_REGION=your_aws_region
VITE_ENCRYPTION_KEY=your_32_byte_encryption_key

# Agent IDs
VITE_JULIET_AGENT_ID=your_juliet_agent_id
VITE_BOOK_AGENT_ID=your_book_agent_id
VITE_TRAVEL_AGENT_ID=your_travel_agent_id
```

4. Start the development server:
```bash
npm run dev
```

## Development Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Architecture

Remo uses a multi-agent architecture where:
1. Main Remo service handles general queries and blockchain operations
2. Juliet orchestrates specialized agents
3. Book and Travel agents provide domain-specific expertise
4. All agents communicate through AWS Bedrock
5. Data persists in DynamoDB
6. User authentication via Privy

## Future Enhancements

- Enhanced knowledge base integration
- Advanced document analysis
- Calendar management
- Email composition assistance
- Meeting scheduling
- Project management tools
- Additional specialized agents 