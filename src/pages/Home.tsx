import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '../context/LoginContext';
import styles from '../styles/Home.module.css';

const Home = () => {
  const { authenticated } = usePrivy();
  const { openLogin } = useLogin();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log('Create Agent clicked');
    openLogin();
  };

  const handleSearchClick = () => {
    console.log('Search icon clicked');
    // Search functionality will be added later
  };

  const handleAIClick = () => {
    console.log('AI icon clicked');
    // AI functionality will be added later
  };

  // Redirect to main page when authenticated
  useEffect(() => {
    if (authenticated) {
      navigate('/main');
    }
  }, [authenticated, navigate]);

  return (
    <div className={styles.home}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>REMO</div>
        <div className={styles.iconGroup}>
          <button 
            type="button" 
            onClick={handleSearchClick} 
            className={styles.navIcon}
            aria-label="Search"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button 
            type="button" 
            onClick={handleAIClick} 
            className={styles.navIcon}
            aria-label="AI Chat"
          >
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 8l-4 4 4 4 4-4-4-4z"/>
              <path d="M12 16l-4-4 4-4 4 4-4 4z"/>
            </svg>
          </button>
        </div>
      </nav>
      
      <div className={styles.heroContent}>
        <div className={styles.textLine}>
          <span className={styles.project}>PROJECT</span>{" "}
          <span className={styles.remo}>REMO</span>
        </div>
        <div className={styles.textLine}>
          Personal AI Assistant that can be hired by every human in the planet
        </div>
        <button 
          type="button" 
          onClick={handleLoginClick} 
          className={styles.createButton}
        >
          Create Your Agent Now
        </button>
      </div>

      <div className={styles.descriptionSection}>
        <div className={styles.descriptionContent}>
          <div className={styles.descriptionText}>
            Project Remo is your Personal AI assistant which helps you to do all the activities as same as a hired assistant.
          </div>
          <button 
            type="button" 
            onClick={handleLoginClick} 
            className={styles.createButton}
          >
            Hello, I am Remo your....
          </button>
        </div>
      </div>

      <div className={styles.trustedSection}>
        <div className={styles.trustedContent}>
          <h2 className={styles.trustedHeading}>TRUSTED BY</h2>
          <div className={styles.trustedLogos}>
            <div className={styles.trustedItem}>
              <span className={styles.companyName}>Autonome</span>
            </div>
            <div className={styles.trustedItem}>
              <span className={styles.companyName}>Privy</span>
            </div>
            <div className={styles.trustedItem}>
              <span className={styles.companyName}>OpenAI</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <div className={styles.featuresContent}>
          <h2 className={styles.featuresHeading}>FEATURES</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureBlock}>
              <div className={styles.featureIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 10C41.05 10 50 18.95 50 30C50 41.05 41.05 50 30 50C18.95 50 10 41.05 10 30C10 18.95 18.95 10 30 10ZM30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5Z" fill="url(#paint0_linear)"/>
                  <path d="M32.5 20H27.5V32.5H40V27.5H32.5V20Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="5" y1="5" x2="55" y2="55" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF6B6B"/>
                      <stop offset="1" stopColor="#FFE66D"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="27.5" y1="20" x2="40" y2="32.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF6B6B"/>
                      <stop offset="1" stopColor="#FFE66D"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>NOTIFYING</h3>
              <p className={styles.featureDescription}>Stay informed with real-time notifications</p>
            </div>
            <div className={styles.featureBlock}>
              <div className={styles.featureIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M45 15H40V12.5C40 11.125 38.875 10 37.5 10C36.125 10 35 11.125 35 12.5V15H25V12.5C25 11.125 23.875 10 22.5 10C21.125 10 20 11.125 20 12.5V15H15C12.25 15 10 17.25 10 20V45C10 47.75 12.25 50 15 50H45C47.75 50 50 47.75 50 45V20C50 17.25 47.75 15 45 15Z" fill="url(#paint0_linear)"/>
                  <path d="M30 35L25 30L27.5 27.5L30 30L37.5 22.5L40 25L30 35Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="10" y1="10" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4ECDC4"/>
                      <stop offset="1" stopColor="#556270"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="25" y1="22.5" x2="40" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4ECDC4"/>
                      <stop offset="1" stopColor="#556270"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>REMINDERS</h3>
              <p className={styles.featureDescription}>Never miss important tasks or events</p>
            </div>
            <div className={styles.featureBlock}>
              <div className={styles.featureIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M45 15H15C12.25 15 10 17.25 10 20V40C10 42.75 12.25 45 15 45H45C47.75 45 50 42.75 50 40V20C50 17.25 47.75 15 45 15Z" fill="url(#paint0_linear)"/>
                  <path d="M30 25L22.5 32.5H27.5V37.5H32.5V32.5H37.5L30 25Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="10" y1="15" x2="50" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A8E6CF"/>
                      <stop offset="1" stopColor="#3D84A8"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="22.5" y1="25" x2="37.5" y2="37.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A8E6CF"/>
                      <stop offset="1" stopColor="#3D84A8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>SUGGESTIONS</h3>
              <p className={styles.featureDescription}>Smart recommendations to enhance productivity</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.servicesSection}>
        <div className={styles.servicesContent}>
          <h2 className={styles.servicesHeading}>REMO PROVIDES</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M45 15H15C12.25 15 10 17.25 10 20V40C10 42.75 12.25 45 15 45H45C47.75 45 50 42.75 50 40V20C50 17.25 47.75 15 45 15Z" fill="url(#paint0_linear)"/>
                  <path d="M25 25H35M25 35H35" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="10" y1="15" x2="50" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6C63FF"/>
                      <stop offset="1" stopColor="#3B82F6"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="25" y1="25" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF"/>
                      <stop offset="1" stopColor="#E5E7EB"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Personal Use</h3>
              <p className={styles.serviceDescription}>Smart email management that filters important messages and provides timely reminders, ensuring you never miss crucial communications.</p>
            </div>

            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M45 15L30 5L15 15V35L30 45L45 35V15Z" fill="url(#paint0_linear)"/>
                  <path d="M30 25L35 30L30 35L25 30L30 25Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="15" y1="5" x2="45" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#10B981"/>
                      <stop offset="1" stopColor="#047857"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="25" y1="25" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF"/>
                      <stop offset="1" stopColor="#E5E7EB"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Building Portfolios</h3>
              <p className={styles.serviceDescription}>Personalized investment strategies based on market trends and your preferences, creating optimized portfolios for stocks and cryptocurrencies.</p>
            </div>

            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M45 15H15C12.25 15 10 17.25 10 20V40C10 42.75 12.25 45 15 45H45C47.75 45 50 42.75 50 40V20C50 17.25 47.75 15 45 15Z" fill="url(#paint0_linear)"/>
                  <path d="M20 30H40M30 20V40" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="10" y1="15" x2="50" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B"/>
                      <stop offset="1" stopColor="#D97706"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="20" y1="20" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF"/>
                      <stop offset="1" stopColor="#E5E7EB"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>News</h3>
              <p className={styles.serviceDescription}>Comprehensive news coverage tailored to your location and interests, delivering both global headlines and local updates that matter to you.</p>
            </div>

            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 5L40 20H20L30 5Z" fill="url(#paint0_linear)"/>
                  <path d="M15 25H45L40 45H20L15 25Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="20" y1="5" x2="40" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60A5FA"/>
                      <stop offset="1" stopColor="#3B82F6"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="15" y1="25" x2="45" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#93C5FD"/>
                      <stop offset="1" stopColor="#60A5FA"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Weather</h3>
              <p className={styles.serviceDescription}>Proactive weather monitoring that syncs with your schedule, providing smart recommendations for your planned activities based on real-time conditions.</p>
            </div>

            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5Z" fill="url(#paint0_linear)"/>
                  <path d="M30 20V40M20 30H40" stroke="url(#paint1_linear)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="5" y1="5" x2="55" y2="55" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F87171"/>
                      <stop offset="1" stopColor="#DC2626"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="20" y1="20" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF"/>
                      <stop offset="1" stopColor="#E5E7EB"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className={styles.serviceTitle}>Health</h3>
              <p className={styles.serviceDescription}>Daily health monitoring and personalized wellness recommendations based on your activities and conditions, helping you maintain optimal health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 