import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  Menu, 
  X, 
  Code, 
  BrainCircuit, 
  Server, 
  Database,
  GraduationCap,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

const BandCard = lazy(() => import('./components/BandCard'));

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [timeStr, setTimeStr] = useState('');

  // Live dynamic clock for dark mode
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  // Update body class when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Monitor scrolling to highlight navigation links
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 120;

      sections.forEach((section) => {
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;
        const id = section.getAttribute('id') || '';

        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  const navItems = ['projects', 'skills', 'about', 'contact'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header className={`header ${theme === 'dark' ? 'header-dark' : ''}`}>
        <div className="container header-container">
          {theme === 'dark' ? (
            <div 
              onClick={() => scrollTo('home')} 
              className="logo-dark-mode" 
              style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div className="logo-initial-badge">T</div>
              <span className="logo-name-dark">TAPASYA</span>
              <span className="logo-dot-dark">&middot;</span>
              <span className="logo-title-dark">ENGINEER</span>
            </div>
          ) : (
            <div 
              onClick={() => scrollTo('home')} 
              className="logo" 
              style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontWeight: 300, fontSize: '18px' }}>&larr;</span> tap<span>.</span>
            </div>
          )}

          <nav className="nav-links">
            {theme === 'dark' ? (
              <>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }} className={`nav-link-dark ${activeSection === 'home' ? 'active' : ''}`}>HOME</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} className={`nav-link-dark ${activeSection === 'about' ? 'active' : ''}`}>ABOUT</a>
                <a href="#projects" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }} className={`nav-link-dark ${activeSection === 'projects' ? 'active' : ''}`}>SHOWCASE</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }} className={`nav-link-dark ${activeSection === 'contact' ? 'active' : ''}`}>CONTACT</a>
                <span className="time-display-dark">{timeStr}</span>
              </>
            ) : (
              <>
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item);
                    }}
                    className={`nav-link ${activeSection === item ? 'active' : ''}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {item}
                  </a>
                ))}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', margin: '0 4px', textDecoration: 'underline' }}>EN</span>
                <a 
                  href="mailto:tapasyashrestha9@gmail.com" 
                  className="btn-header-email"
                >
                  tapasyashrestha9@gmail.com
                </a>
              </>
            )}

            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className={`btn-theme-toggle ${theme === 'dark' ? 'btn-theme-toggle-dark' : ''}`}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </nav>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ color: theme === 'dark' ? '#ffffff' : 'var(--foreground)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav className={`mobile-nav ${theme === 'dark' ? 'mobile-nav-dark' : ''}`}>
          {theme === 'dark' ? (
            <>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); setMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>HOME</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); setMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>ABOUT</a>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollTo('projects'); setMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}>SHOWCASE</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); setMobileMenuOpen(false); }} className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>CONTACT</a>
              <button 
                onClick={() => { setTheme('light'); setMobileMenuOpen(false); }} 
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Sun size={14} /> Light Mode
              </button>
            </>
          ) : (
            <>
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item);
                  }}
                  className={`nav-link ${activeSection === item ? 'active' : ''}`}
                  style={{ textTransform: 'capitalize', padding: '8px 0', fontSize: '16px' }}
                >
                  {item}
                </a>
              ))}
              <a 
                href="mailto:tapasyashrestha9@gmail.com" 
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px', fontSize: '12px' }}
              >
                tapasyashrestha9@gmail.com
              </a>
              <button 
                onClick={() => { setTheme('dark'); setMobileMenuOpen(false); }} 
                className="btn-secondary"
                style={{ width: '100%', marginTop: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Moon size={14} /> Dark Mode
              </button>
            </>
          )}
        </nav>
      )}

      {/* HERO SECTION */}
      {theme === 'dark' ? (
        <section id="home" className="hero-section-dark">
          <div className="container hero-container-dark">
            <div className="hero-available-tag">
              <span className="sparkle-icon">✦</span>
              <span className="tag-text">AVAILABLE FOR WORK</span>
              <span className="cursor-blink">|</span>
            </div>

            <div className="hero-title-dark-group">
              <h1 className="hero-title-dark-white">Fullstack</h1>
              <h1 className="hero-title-dark-gray">AI/ML Engineer</h1>
            </div>

            <p className="hero-desc-dark">
              Building intelligent, full-stack applications with clean, responsive, and elegant interfaces.
              Turning machine learning algorithms and designs into engaging digital experiences.
            </p>

            <div className="hero-badges-dark">
              <span className="badge-dark">React.js</span>
              <span className="badge-dark">TypeScript</span>
              <span className="badge-dark">Python</span>
              <span className="badge-dark">PyTorch</span>
            </div>

            <div className="hero-actions-dark">
              <button onClick={() => setShowCard(!showCard)} className="btn-accent-outline">
                {showCard ? "HIDE CARD" : "SHOW CARD"}
              </button>
              <button onClick={() => scrollTo('about')} className="btn-dark-solid">
                ABOUT ME
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section id="home" className="hero-section">
          <div className="container">
            <div className="hero-content-centered">
              
              <div className="hero-subtitle-centered">
                <span>👋, my name is Tapasya and I am a freelance</span>
              </div>

              <div className="hero-stack-container">
                <h1 className="hero-text-row text-solid">FULLSTACK</h1>
                
                <div className="hero-avatar-wrapper">
                  <img 
                    src="/avatar.png" 
                    alt="Tapasya Shrestha" 
                    className="hero-avatar-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/avatar.jpg';
                    }}
                  />
                </div>

                <h1 className="hero-text-row text-outline">&amp; AI/ML</h1>
                <h1 className="hero-text-row text-outline">ENGINEER</h1>
              </div>

              <div className="hero-details-row">
                <div className="hero-details-location">
                  based in Jaipur, India.
                </div>
                <div className="hero-details-logos">
                  <span className="tech-logo">React</span>
                  <span className="tech-logo-dot">&bull;</span>
                  <span className="tech-logo">TypeScript</span>
                  <span className="tech-logo-dot">&bull;</span>
                  <span className="tech-logo">Python</span>
                  <span className="tech-logo-dot">&bull;</span>
                  <span className="tech-logo">PyTorch</span>
                  <span className="tech-logo-dot">&bull;</span>
                  <span className="tech-logo">SQL</span>
                </div>
              </div>

              <div className="hero-actions-centered">
                <button onClick={() => scrollTo('projects')} className="btn-primary-pill">
                  You need a developer
                </button>
                <button onClick={() => scrollTo('contact')} className="btn-secondary-pill">
                  You need an AI/ML engineer
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      <section id="projects" className="section" style={{ backgroundColor: '#09090c' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Project <span>Work</span></h2>
            <div className="section-line"></div>
          </div>

          <div className="grid-cols-2">
            {/* Project 1 */}
            <div className="glow-card project-card">
              <div>
                <div className="project-top">
                  <span className="project-category">Rural Healthcare Assistant</span>
                  <div className="badge badge-primary">Featured</div>
                </div>
                <h3 className="project-title">SEHAI – AI rural healthcare helper</h3>
                <p className="project-desc">
                  Voice-enabled healthcare platform that assists ANMs (Auxiliary Nurse Midwives) in recording patient symptoms, automating diagnostics, and managing rural clinical workflows.
                </p>
                <ul className="project-bullets">
                  <li className="project-bullet">
                    Integrated an XGBoost classifier trained on clinical symptom datasets to predict probable disease risks and support early diagnostics.
                  </li>
                  <li className="project-bullet">
                    Designed an AI-assisted triage and referral system enabling seamless escalation from Sub-Centres to PHCs and CHCs.
                  </li>
                  <li className="project-bullet">
                    Implemented multilingual symptom reporting workflows to improve accessibility for frontline rural healthcare workers.
                  </li>
                </ul>
              </div>
              <div className="project-tech">
                <span className="badge">React.js</span>
                <span className="badge">TypeScript</span>
                <span className="badge">Python</span>
                <span className="badge">XGBoost</span>
                <span className="badge">Tailwind CSS</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="glow-card project-card">
              <div>
                <div className="project-top">
                  <span className="project-category">Machine Learning</span>
                  <div className="badge">Classifier</div>
                </div>
                <h3 className="project-title">SMS Spam Detector</h3>
                <p className="project-desc">
                  A high-performance spam classification engine designed to clean and classify incoming messages using machine learning.
                </p>
                <ul className="project-bullets">
                  <li className="project-bullet">
                    Trained ML models on 5,572 real-world SMS records to achieve an outstanding 98.1% detection accuracy.
                  </li>
                  <li className="project-bullet">
                    Utilized TF-IDF vectorization and selected a Logistic Regression model to maximize the recall rate of spam detection.
                  </li>
                  <li className="project-bullet">
                    Deployed the model as an interactive web dashboard using Streamlit for real-time inference testing and model evaluation.
                  </li>
                </ul>
              </div>
              <div className="project-tech">
                <span className="badge">Python</span>
                <span className="badge">Scikit-Learn</span>
                <span className="badge">Pandas</span>
                <span className="badge">Streamlit</span>
                <span className="badge">NumPy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Technical <span>Skills</span></h2>
            <div className="section-line"></div>
          </div>

          <div className="skills-grid">
            <div className="skill-tag">
              <BrainCircuit size={28} />
              <span>Machine Learning</span>
            </div>
            <div className="skill-tag">
              <Code size={28} />
              <span>React &amp; TS</span>
            </div>
            <div className="skill-tag">
              <Server size={28} />
              <span>Python</span>
            </div>
            <div className="skill-tag">
              <Database size={28} />
              <span>SQL / Databases</span>
            </div>
            <div className="skill-tag">
              <span>Scikit-Learn</span>
            </div>
            <div className="skill-tag">
              <span>Pandas / NumPy</span>
            </div>
            <div className="skill-tag">
              <span>Vite</span>
            </div>
            <div className="skill-tag">
              <span>Tailwind CSS</span>
            </div>
            <div className="skill-tag">
              <span>Streamlit</span>
            </div>
            <div className="skill-tag">
              <span>Git &amp; Versioning</span>
            </div>
            <div className="skill-tag">
              <span>C Language</span>
            </div>
            <div className="skill-tag">
              <span>HTML5 / CSS3</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & TIMELINE SECTION */}
      <section id="about" className="section" style={{ backgroundColor: '#09090c' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About <span>Me</span></h2>
            <div className="section-line"></div>
          </div>

          <div className="grid-cols-2" style={{ alignItems: 'start' }}>
            {/* Education Card */}
            <div className="glow-card education-card">
              <div className="education-left">
                <div className="education-icon">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h3 className="education-title">B.Tech in Computer Science and Engineering</h3>
                  <p className="education-school">Manipal University Jaipur</p>
                </div>
              </div>
              <div className="education-right">
                <p className="education-status">Currently: 3rd Year</p>
                <p className="education-year">Graduation: 2028</p>
              </div>
            </div>

            {/* Experience Card */}
            <div className="glow-card" style={{ padding: '32px' }}>
              <div className="timeline">
                <div className="timeline-dot"></div>
                <div className="timeline-item">
                  <div className="timeline-header">
                    <h3 className="timeline-role">Senior Coordinator</h3>
                    <span className="timeline-date">May 2025 – May 2026</span>
                  </div>
                  <p className="timeline-company">LearnIT Club — Manipal University Jaipur</p>
                  <ul className="timeline-desc" style={{ marginTop: '12px' }}>
                    <li className="timeline-bullet">
                      Organized campus-wide hackathons, technical workshops, and coding challenges.
                    </li>
                    <li className="timeline-bullet">
                      Mentored 10+ junior members in Web Development and Machine Learning foundations.
                    </li>
                    <li className="timeline-bullet">
                      Led cross-functional teams in club management and coordinated speaker events.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get <span>In Touch</span></h2>
            <div className="section-line"></div>
          </div>

          <div className="contact-container">
            <p className="contact-text">
              I am currently open to internships and junior developer opportunities. If you have an exciting project, a role that fits my profile, or just want to connect, feel free to reach out!
            </p>

            <div className="contact-links">
              <a href="mailto:tapasyashrestha9@gmail.com" className="btn-primary" style={{ gap: '8px' }}>
                <Mail size={16} /> tapasyashrestha9@gmail.com
              </a>
              <a href="tel:8077559884" className="btn-secondary" style={{ gap: '8px' }}>
                <Phone size={16} /> +91 8077559884
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '48px' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="outline-icon-button" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="outline-icon-button" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="container">
          <p className="footer-text">
            Designed &amp; Built by <span>Tapasya Shrestha</span> &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Floating 3D Card Toggle Button */}
      <button 
        onClick={() => setShowCard(!showCard)} 
        className="floating-card-toggle"
        title={showCard ? "Hide 3D Card" : "Show 3D Card"}
        aria-label="Toggle 3D Card"
      >
        <Sparkles size={20} />
      </button>

      {/* 3D ID Card Floating */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-floating-card-container"
          >
            <div className="hero-floating-card-header">
              <span className="card-header-dot"></span>
              <span className="card-header-title">3D Interactive ID Card</span>
              <button className="card-close-btn" onClick={() => setShowCard(false)}>&times;</button>
            </div>
            <div className="hero-floating-card-body">
              <Suspense fallback={<div className="loading-spinner">Loading 3D Card...</div>}>
                <BandCard />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
