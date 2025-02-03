import React, { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chat.module.css';
import { bedrockService } from '../agent/bedrockService';
import { remoPersonality } from '../agent/config';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

const Chat: React.FC = () => {
  const { user, logout } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLocalDeploy = () => {
    console.log('Deploying locally...');
    // Implementation will be added later
  };

  const handleAutonomeDeploy = () => {
    console.log('Deploying to Autonome...');
    // Implementation will be added later
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await bedrockService.generateResponse([...messages, userMessage]);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response from Remo');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's name (email or wallet address)
  const getUserName = () => {
    if (!user) return 'Guest';
    if (user.email) return user.email.toString().split('@')[0];
    if (user.wallet?.address) {
      return `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`;
    }
    return 'Guest';
  };

  return (
    <div className={styles.chatPage}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>REMO</div>
        
        {/* Local Section */}
        <div className={styles.sidebarSection}>
          <h2 className={styles.sectionTitle}>Create Using Local</h2>
          <button 
            className={styles.deployButton} 
            onClick={handleLocalDeploy}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Deploy
          </button>
        </div>

        {/* Autonome Section */}
        <div className={styles.sidebarSection}>
          <h2 className={styles.sectionTitle}>Create Using Autonome</h2>
          <button 
            className={styles.deployButton} 
            onClick={handleAutonomeDeploy}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Deploy
          </button>
        </div>

        {/* Profile Section */}
        <div className={styles.sidebarSection}>
          <div className={styles.profileMenu}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.profileButton}
            >
              {user?.email?.toString() || user?.wallet?.address?.slice(0, 6) + '...' + user?.wallet?.address?.slice(-4) || 'Guest'}
            </button>
            {isOpen && (
              <div className={styles.profileDropdown}>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsOpen(false);
                  }}
                  className={styles.profileOption}
                >
                  Profile
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className={styles.profileOption}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.mainChat}>
        <div className={styles.welcomeMessage}>
          Hello, {getUserName()}
        </div>
        <div className={styles.messagesContainer}>
          {messages.map(message => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'assistant' ? styles.assistant : styles.user
              }`}
            >
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageTime}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {error && (
            <div className={`${styles.message} ${styles.error}`}>
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Remo..."
            className={styles.input}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit" 
            className={styles.sendButton} 
            disabled={!input.trim() || isLoading}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 