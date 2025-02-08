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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Add new state for chat history
  const [chatHistory] = useState([
    { id: '1', title: 'Previous Chat 1' },
    { id: '2', title: 'Previous Chat 2' },
    { id: '3', title: 'Previous Chat 3' },
  ]);

  useEffect(() => {
    if (user) {
      const walletAccount = user.linkedAccounts?.find(account => account.type === 'wallet');
      if (walletAccount?.address) {
        console.log('Setting userId from connected wallet:', walletAccount.address);
        bedrockService.setUserId(walletAccount.address);
      } else {
        console.log('No connected wallet found');
      }
    }
  }, [user]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const getUserName = () => {
    if (!user) return 'Guest';
    
    const walletAccount = user.linkedAccounts?.find(account => account.type === 'wallet');
    if (walletAccount) {
      return `${walletAccount.address.slice(0, 6)}...${walletAccount.address.slice(-4)}`;
    }
    
    if (user.email) return user.email.toString().split('@')[0];
    
    return 'Guest';
  };

  return (
    <div className={styles.chatPage}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
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
            New chat
          </button>
        </div>

        {/* Chat History */}
        <div className={styles.chatHistory}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={styles.chatItem}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={styles.chatIcon}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className={styles.chatTitle}>{chat.title}</span>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className={styles.userSection}>
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={styles.userButton}
          >
            <div className={styles.userInfo}>
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
            </div>
          </button>
          {isOpen && (
            <div ref={dropdownRef} className={styles.userDropdown}>
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className={styles.dropdownItem}
              >
                Profile
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                  setIsOpen(false);
                }}
                className={styles.dropdownItem}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.mainChat}>
        {messages.length === 0 ? (
          <div className={styles.welcomeContainer}>
            <h1 className={styles.welcomeTitle}>Hello, I am Remo how can I help you?</h1>
          </div>
        ) : (
          <div className={styles.messagesContainer}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  message.role === 'assistant' ? styles.assistant : styles.user
                }`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.avatar}>
                    {message.role === 'assistant' ? 'R' : 'U'}
                  </div>
                  <div className={styles.message}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <div className={styles.avatar}>R</div>
                  <div className={styles.message}>
                    <div className={styles.loadingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className={`${styles.messageWrapper} ${styles.error}`}>
                <div className={styles.messageContent}>
                  <div className={styles.avatar}>R</div>
                  <div className={styles.message}>
                    {error}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.inputWrapper}>
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
                width="16"
                height="16"
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
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>💻</span>
              Code
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🎓</span>
              Get advice
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📝</span>
              Summarize text
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>✍️</span>
              Help me write
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📊</span>
              Analyze data
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>⋯</span>
              More
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 