import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.scss';

const Main = () => {
  const { logout } = usePrivy();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="main-page">
      <nav className="navbar">
        <div className="logo">REMO</div>
        <button onClick={handleLogout} className="create-button">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Main; 