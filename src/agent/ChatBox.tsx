import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { bedrockService } from './bedrockService';
import styles from './ChatBox.module.css';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello, I am Remo how can I help you?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
    }

    try {
      const response = await bedrockService.generateResponse([userMessage]);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
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

  const handleActionClick = (action: string) => {
    let message = '';
    switch (action) {
      case 'tasks':
        message = 'show tasks';
        break;
      case 'send':
        message = 'send 0.0001 eth to susmitha';
        break;
      case 'todo':
        message = 'add say hi to simba to the to do list';
        break;
      case 'book':
        message = 'suggest me a book';
        break;
      case 'wallet':
        message = 'create wallet called Pepe';
        break;
      default:
        return;
    }
    
    setInput(message);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.height = 'inherit';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.role === 'assistant' ? styles.assistant : styles.user
            }`}
          >
            <div className={styles.messageContent}>
              {message.content}
            </div>
            <div className={styles.timestamp}>
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

      <div className={styles.inputSection}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Message Remo..."
            rows={1}
            className={styles.input}
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
            disabled={isLoading || !input.trim()}
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

        <div className={styles.bottomActions}>
          <button 
            className={styles.actionButton}
            onClick={() => handleActionClick('tasks')}
          >
            <span className={styles.actionIcon}>📋</span>
            Show tasks
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => handleActionClick('send')}
          >
            <span className={styles.actionIcon}>💸</span>
            Send 0.0001 ETH
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => handleActionClick('todo')}
          >
            <span className={styles.actionIcon}>✅</span>
            Add to-do
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => handleActionClick('book')}
          >
            <span className={styles.actionIcon}>📚</span>
            Book suggestion
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => handleActionClick('wallet')}
          >
            <span className={styles.actionIcon}>👛</span>
            Create wallet
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>⋯</span>
            More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox; 