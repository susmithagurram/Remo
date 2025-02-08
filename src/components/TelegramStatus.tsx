import React from 'react';

const TelegramStatus: React.FC = () => {
  return (
    <div className="telegram-status" style={{ 
      padding: '20px',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2 style={{ marginBottom: '10px' }}>Integration Status</h2>
      <p style={{ 
        color: '#666',
        fontWeight: 'bold'
      }}>
        Telegram Bot: Available via API endpoint
      </p>
      <p style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.7 }}>
        Connect with us on Telegram: @your_bot_username
      </p>
    </div>
  );
};

export default TelegramStatus; 