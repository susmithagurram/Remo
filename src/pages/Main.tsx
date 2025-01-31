import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.scss';
import ProfileMenu from '../components/ProfileMenu';

const Main = () => {
  const { ready } = usePrivy();
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <nav className="navbar">
        <div className="logo">REMO</div>
        <ProfileMenu />
      </nav>
    </div>
  );
};

export default Main; 