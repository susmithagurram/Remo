import { createContext, useContext, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const LoginContext = createContext<{ openLogin: () => Promise<void> } | null>(null);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const { login } = usePrivy();
  
  const openLogin = useCallback(async () => {
    await login();
  }, [login]);

  return (
    <LoginContext.Provider value={{ openLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) throw new Error('useLogin must be used within LoginProvider');
  return context;
}; 