import { usePrivy } from '@privy-io/react-auth';

interface LoginButtonProps {
  className?: string;
  children: React.ReactNode;
}

const LoginButton = ({ className, children }: LoginButtonProps) => {
  const { login } = usePrivy();

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();  // Prevent event bubbling
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

export default LoginButton; 