import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home = () => {
  const { authenticated } = usePrivy();
  const { login } = usePrivy();
  const navigate = useNavigate();
  const [showAllServices, setShowAllServices] = useState(false);

  const handleLoginClick = () => {
    console.log('Create Agent clicked');
    login();
  };

  const handleSearchClick = () => {
    console.log('Search icon clicked');
    // Search functionality will be added later
  };

  const handleAIClick = () => {
    console.log('AI icon clicked');
    if (!authenticated) {
      login();
    } else {
      navigate('/chat');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Redirect to chat page when authenticated
  useEffect(() => {
    if (authenticated) {
      navigate('/chat');
    }
  }, [authenticated, navigate]);

  return (
    <div className={styles.home}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>REMO</div>
          <div className={styles.navLinks}>
            <div 
              className={styles.navItem}
              onClick={() => scrollToSection('about')}
            >
              About
              <svg className={styles.dropdownIcon} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div 
              className={styles.navItem}
              onClick={() => scrollToSection('features')}
            >
              Features
              <svg className={styles.dropdownIcon} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.navItem}>
              Docs
              <svg className={styles.dropdownIcon} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
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
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 21c-4.97 0-9-3.582-9-8 0-4.418 4.03-8 9-8s9 3.582 9 8c0 1.06-.22 2.087-.627 3.025-.154.356-.154.763.013 1.114L22 20l-3.763-1.876c-.248-.123-.52-.184-.792-.184-.197 0-.395.033-.585.099C15.615 20.589 13.873 21 12 21z" />
              <circle cx="8" cy="13" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="13" r="1" fill="currentColor" stroke="none" />
              <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
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
          Personal AI Assistant that can be hired by every human<br />
          in the planet
        </div>
        <button 
          type="button" 
          onClick={handleLoginClick} 
          className={`${styles.createButton} ${styles.largeButton}`}
        >
          Remo, being awesome is my thing
          <svg 
            className={styles.buttonArrow} 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="8 4 16 12 8 20" />
          </svg>
        </button>
      </div>

      <div id="about" className={styles.descriptionSection}>
        <div className={styles.descriptionContent}>
          <div className={styles.descriptionImage}>
            <img src="/About.jpg" alt="Remo AI Assistant" />
          </div>
          <div className={styles.descriptionTextWrapper}>
            <div className={styles.descriptionText}>
              Remo is a "AI Personal Assistant" who can be hired by every human on planet.
              <br /><br />
              How about reminding you what to do, buy a stock/coin when you are enjoying your vacation, with an unimaginable trust.
              <br /><br />
              It's time for everyone to have their own assistant not just the rich!
            </div>
          </div>
        </div>
      </div>

      <div id="features" className={styles.featuresSection}>
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
                <img src="/Personaluse.jpg" alt="Personal Use" className={styles.serviceImage} />
              </div>
              <h3 className={styles.serviceTitle}>Personal Use</h3>
              <p className={styles.serviceDescription}>Smart email management that filters important messages and provides timely reminders, ensuring you never miss crucial communications.</p>
            </div>

            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <img src="/BuildingPortflio.jpg" alt="Building Portfolios" className={styles.serviceImage} />
              </div>
              <h3 className={styles.serviceTitle}>Building Portfolios</h3>
              <p className={styles.serviceDescription}>Personalized investment strategies based on market trends and your preferences, creating optimized portfolios for stocks and cryptocurrencies.</p>
            </div>

            <div className={styles.serviceBlock}>
              <div className={styles.serviceIcon}>
                <img src="/News.jpg" alt="News" className={styles.serviceImage} />
              </div>
              <h3 className={styles.serviceTitle}>News</h3>
              <p className={styles.serviceDescription}>Comprehensive news coverage tailored to your location and interests, delivering both global headlines and local updates that matter to you.</p>
            </div>

            {showAllServices && (
              <>
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
              </>
            )}
          </div>

          <button 
            onClick={() => setShowAllServices(!showAllServices)}
            className={styles.viewMoreButton}
          >
            {showAllServices ? 'View less' : 'View more'}
            <svg 
              className={`${styles.buttonArrow} ${showAllServices ? styles.buttonArrowUp : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="8 4 16 12 8 20" />
            </svg>
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Social Section */}
          <div className={styles.socialBar}>
            <span className={styles.followText}>Follow us</span>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Telegram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Discord">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.footerDivider} />

          {/* Three Column Layout */}
          <div className={styles.footerColumns}>
            {/* About Column */}
            <div className={styles.footerColumn}>
              <h3>About</h3>
              <ul>
                <li><a href="#">Research</a></li>
                <li><a href="#">Blogs</a></li>
                <li><a href="#">Newsletters</a></li>
                <li><a href="#">Docs</a></li>
              </ul>
            </div>

            {/* Learn More Column */}
            <div className={styles.footerColumn}>
              <h3>Learn more</h3>
              <ul>
                <li><a href="#">AWS</a></li>
                <li><a href="#">Viem</a></li>
                <li><a href="#">Autonome</a></li>
                <li><a href="#">Coinbase</a></li>
              </ul>
            </div>

            {/* Sign Up Column */}
            <div className={styles.footerColumn}>
              <h3>Sign up for updates on our latest innovations</h3>
              <div className={styles.signupForm}>
                <div className={styles.inputWrapper}>
                  <input type="email" placeholder="Email address" />
                </div>
                <div className={styles.termsCheckbox}>
                  <label>
                    <input type="checkbox" />
                    <span>I accept Remo's Terms and Conditions and acknowledge that my information will be used in accordance with Remo's Privacy Policy.</span>
                  </label>
                </div>
                <button type="button" className={styles.signupButton}>
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className={styles.bottomLinks}>
          <div className={styles.bottomLinksContent}>
            <a href="#" className={styles.logo}>Remo</a>
            <div className={styles.legalLinks}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 