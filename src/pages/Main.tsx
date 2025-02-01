import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Main.module.css';
import ProfileMenu from '../components/ProfileMenu';

const Main = () => {
  const { ready } = usePrivy();
  const navigate = useNavigate();

  return (
    <div className={styles.mainPage}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>REMO</div>
        <ProfileMenu />
      </nav>
    </div>
  );
};

export default Main; 