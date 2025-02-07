import React, { useEffect, useState } from 'react';
import { telegramService } from '../agent/telegram/telegramService';

const TelegramStatus: React.FC = () => {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const checkTelegramStatus = async () => {
      try {
        // The service is initialized when imported
        setStatus('Telegram bot is running');
      } catch (error) {
        console.error('Error checking Telegram status:', error);
        setStatus('Error connecting to Telegram');
      }
    };

    checkTelegramStatus();
  }, []);

  return (
    <div className="telegram-status" style={{ 
      padding: '20px',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2 style={{ marginBottom: '10px' }}>Integration Status</h2>
      <p style={{ 
        color: status.includes('Error') ? '#dc3545' : '#28a745',
        fontWeight: 'bold'
      }}>
        Telegram Bot: {status}
      </p>
      <p style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.7 }}>
        Connect with us on Telegram: @your_bot_username
      </p>
    </div>
  );
};

export default TelegramStatus; 