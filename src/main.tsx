import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';
import './styles/index.css';
import { telegramService } from './agent/telegram/telegramService';

// Initialize Telegram service
console.log('Initializing Telegram service...');
telegramService;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet', 'google', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
); 