# Remo AI Assistant

A sophisticated personal AI assistant inspired by Donna Paulsen from Suits. Built with React, TypeScript, and AWS Bedrock (Claude 3 Sonnet).

## Features

- Professional and intuitive AI assistant
- Real-time chat interface
- Responsive design
- Secure authentication with Privy
- AWS Bedrock integration for advanced AI capabilities

## Tech Stack

- React
- TypeScript
- Vite
- AWS Bedrock
- Privy Authentication
- Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your credentials:
```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
VITE_AWS_REGION=your_aws_region
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `VITE_PRIVY_APP_ID`: Your Privy application ID
- `VITE_AWS_ACCESS_KEY_ID`: AWS access key for Bedrock
- `VITE_AWS_SECRET_ACCESS_KEY`: AWS secret key for Bedrock
- `VITE_AWS_REGION`: AWS region (e.g., us-east-1)

## Development

The project uses Vite for development. Available commands:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build 