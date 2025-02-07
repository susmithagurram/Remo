import React, { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chat.module.css';
import { bedrockService } from '../agent/bedrockService';

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

  // Add new state for chat history
  const [chatHistory] = useState([
    { id: '1', title: 'Previous Chat 1' },
    { id: '2', title: 'Previous Chat 2' },
    { id: '3', title: 'Previous Chat 3' },
  ]);

  useEffect(() => {
    if (user) {
      // Get the connected wallet address
      const walletAccount = user.linkedAccounts?.find(account => account.type === 'wallet');
      if (walletAccount?.address) {
        console.log('Setting userId from connected wallet:', walletAccount.address);
        bedrockService.setUserId(walletAccount.address);
      } else {
        console.log('No connected wallet found');
      }
    }
  }, [user]);

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
    
    // Check for connected wallets
    const walletAccount = user.linkedAccounts?.find(account => account.type === 'wallet');
    if (walletAccount) {
      return `${walletAccount.address.slice(0, 6)}...${walletAccount.address.slice(-4)}`;
    }
    
    // Fallback to email if available
    if (user.email) return user.email.toString().split('@')[0];
    
    return 'Guest';
  };

  return (
    <div className={styles.chatPage}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>REMO</div>
        
        {/* New Chat Button */}
        <button className={styles.newChatButton}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>

        {/* Chat History */}
        <div className={styles.chatHistory}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={styles.chatItem}>
              <span className={styles.chatIcon}>💬</span>
              <span className={styles.chatTitle}>{chat.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.mainChat}>
        {/* Top Navigation with Profile */}
        <div className={styles.topNav}>
          <div className={styles.profileMenu}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.profileButton}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {getUserName()}
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