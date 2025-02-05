import { usePrivy } from '@privy-io/react-auth';
import { Navigate } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';

// Context
interface LoginContextType {
  openLogin: () => void;
  closeLogin: () => void;
  isLoginOpen: boolean;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Provider Component
export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <LoginContext.Provider 
      value={{
        openLogin: () => setIsLoginOpen(true),
        closeLogin: () => setIsLoginOpen(false),
        isLoginOpen
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

// Hook
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};

// Login Button Component
interface LoginButtonProps {
  className?: string;
  children: React.ReactNode;
}

export const LoginButton = ({ className, children }: LoginButtonProps) => {
  const { login } = usePrivy();

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <a href="#" onClick={handleLogin} className={className}>
      {children}
    </a>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = usePrivy();
  
  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}; 