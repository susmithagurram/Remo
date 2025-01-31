import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '../context/LoginContext';
import '../styles/Home.scss';

const Home = () => {
  const { authenticated } = usePrivy();
  const { openLogin } = useLogin();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    console.log('Button clicked');
    openLogin();
  };

  // Redirect to main page when authenticated
  useEffect(() => {
    if (authenticated) {
      navigate('/main');
    }
  }, [authenticated, navigate]);

  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo">REMO</div>
        <button 
          type="button" 
          onClick={handleClick} 
          className="create-button"
          style={{ pointerEvents: 'auto' }}
        >
          Login
        </button>
      </nav>
      
      <div className="hero-content">
        <div className="text-line complete project-remo">
          <span className="project">PROJECT</span>{" "}
          <span className="remo">REMO</span>
        </div>
        <div className="text-line complete tagline">
          Personal AI Assistant that can be hired by every human in the planet
        </div>
        <button type="button" onClick={handleClick} className="create-button">
          Create Your Agent Now
        </button>
      </div>
    </div>
  );
};

export default Home; 