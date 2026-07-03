import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Menu,
  X,
  GraduationCap,
  ArrowLeft,
  Download,
  Award,
  Briefcase
} from 'lucide-react';

const BandCard = lazy(() => import('./components/BandCard'));
import CircularGallery from './components/CircularGallery';
import TechSphere from './components/TechSphere';
import TextPressure from './components/TextPressure';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import VariableProximity from './components/VariableProximity';
import DotField from './components/DotField';

const projectItems = [
  { image: '/sehai_project.png', text: 'SEHAI' },
  { image: '/vakeel_project.png', text: 'Vakeel' },
  { image: '/tarang_project.png', text: 'Tarang ' }
];

const projectsData = [
  {
    id: 0,
    title: "SEHAI – AI rural healthcare helper",
    category: "Rural Healthcare Assistant / AI Voice Assistant",
    github: "https://github.com/tapasyashrestha/Sehai",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "Vite", "React Router", "XGBoost", "Python"],
    bullets: [
      "Developed a voice-enabled healthcare platform to assist ANMs (Auxiliary Nurse Midwives) in recording patient symptoms and managing rural healthcare workflows.",
      "Integrated an XGBoost classifier trained on symptom data to predict probable diseases, enabling early diagnosis support for frontline healthcare workers in low-resource rural settings.",
      "Designed an AI-assisted triage and referral system enabling seamless escalation of cases from Sub-Centres/ANMs → PHCs (Primary Health Centres) → CHCs (Community Health Centres).",
      "Implemented multilingual symptom-reporting workflows to improve accessibility for healthcare workers and patients across diverse linguistic regions."
    ]
  },
  {
    id: 1,
    title: "Vakeel – Multi-Tenant Legal Tech Platform for Indian Advocate Chambers",
    category: "B2B Legal Tech Platform",
    github: "https://github.com/tapasyashrestha/Vakeel",
    tech: ["Firebase Auth", "Firestore", "Firebase Storage", "FastAPI", "React", "OpenAI Embeddings", "Indian Kanoon API"],
    bullets: [
      "Designing a B2B legal tech platform enabling advocate chambers to manage drafting, case research, and document workflows with verified, source-traceable outputs rather than raw generative speed.",
      "Architected a multi-tenant system using Firebase custom claims and Firestore path-based collection structure, with security rules enforcing strict per-chamber data isolation.",
      "Built a Retrieval-Augmented Generation (RAG) pipeline separating the public Indian Kanoon case-law corpus from private chamber document embeddings, ensuring no cross-tenant leakage.",
      "Defined core product systems spanning a Unified Retrieval Engine, Drafting Layer, Document Handling, Chamber Activity Layer, and a human-entered Deadlines & Obligations Engine; produced full PRD and system architecture documentation."
    ]
  },
  {
    id: 2,
    title: "Tarang (RippleIQ) – AI-Powered Decision Intelligence Platform for E-commerce",
    category: "AI-Powered Decision Intelligence Platform",
    github: "https://github.com/tapasyashrestha/Tarang-Nexora",
    tech: ["React", "Tailwind CSS", "Recharts", "FastAPI", "Scikit-learn", "XGBoost", "Pandas", "PostgreSQL"],
    bullets: [
      "Built a decision intelligence platform that simulates the ripple effects of business decisions (price, inventory, marketing spend) on sales, revenue, delivery performance, and customer satisfaction before implementation.",
      "Implemented dependency and causality mapping using ML-driven scenario simulation to surface hidden relationships between business variables.",
      "Developed risk and consequence detection to flag potential inventory shortages, delivery delays, and rating declines ahead of time, alongside a what-if simulator and revenue/sales forecasting.",
      "Designed an interactive business dashboard (React + Recharts) translating model outputs into strategic recommendations for decision-makers."
    ]
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const contactContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showAboutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAboutModal]);


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
      <header className="header">
        <div className="container header-container">
          <div
            onClick={() => scrollTo('home')}
            className="logo"
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontWeight: 300, fontSize: '18px' }}>&larr;</span> Tapasya<span>.</span>
          </div>

          <nav className="nav-links">
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
                {item === 'about' ? 'education & experience' : item}
              </a>
            ))}
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', margin: '0 4px', textDecoration: 'underline' }}>EN</span>
            <a
              href="/Tapasya_Shrestha_Resume.pdf"
              download="Tapasya_Shrestha_Resume.pdf"
              className="btn-header-email"
            >
              Download Resume
            </a>
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
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
              {item === 'about' ? 'education & experience' : item}
            </a>
          ))}
          <a
            href="/Tapasya_Shrestha_Resume.pdf"
            download="Tapasya_Shrestha_Resume.pdf"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px', fontSize: '12px', textAlign: 'center' }}
          >
            Download Resume
          </a>
        </nav>
      )}

      {/* HERO SECTION */}
      <section id="home" className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
          <DotField
            dotRadius={2.2}
            dotSpacing={14}
            bulgeStrength={60}
            glowRadius={180}
            sparkle={false}
            waveAmplitude={0.4}
            gradientFrom="rgba(11, 11, 12, 0.35)"
            gradientTo="rgba(11, 11, 12, 0.20)"
            glowColor="rgba(0, 0, 0, 0.04)"
          />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-content-centered">

            <div className="hero-subtitle-centered">
              <span>Hello, my name is Tapasya and I am a</span>
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
                3rd Year Student
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
                See my work
              </button>
              <button onClick={() => scrollTo('contact')} className="btn-secondary-pill">
                Hire me
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* MOVING TICKER CAROUSEL */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker-item-group">
            <span className="ticker-item">Tapasya Shrestha</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">Fullstack Developer</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item"><span className="accent">AI/ML Engineer</span></span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">React &amp; TS</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">Python &amp; PyTorch</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">FastAPI</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">SQL</span>
            <span className="ticker-dot">✦</span>
          </div>
          <div className="ticker-item-group" aria-hidden="true">
            <span className="ticker-item">Tapasya Shrestha</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">Fullstack Developer</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item"><span className="accent">AI/ML Engineer</span></span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">React &amp; TS</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">Python &amp; PyTorch</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">Creative Coder</span>
            <span className="ticker-dot">✦</span>
            <span className="ticker-item">Problem Solver</span>
            <span className="ticker-dot">✦</span>
          </div>
        </div>
      </div>

      {/* INTRO/SHOWCASE SECTION (Prince-style light theme) */}
      <section id="intro" className="intro-section-light">
        <div className="container intro-container-light">
          <div className="intro-content-wrapper">
            <div className="intro-left-col">
              <div className="intro-available-tag">
                <span className="sparkle-icon">✦</span>
                <span className="tag-text">AVAILABLE FOR WORK</span>
                <span className="cursor-blink">|</span>
              </div>

              <div className="intro-title-group">
                <h1 className="intro-title-black">My</h1>
                <h1 className="intro-title-gray">Expertise</h1>
              </div>

              <p className="intro-desc">
                Combining full-stack development with AI to build impactful digital solutions. I'm someone who enjoys exploring new ideas, experimenting with emerging technologies, and constantly pushing myself to become a better developer.
              </p>

              <div className="intro-badges">
                <span className="badge-light-pill">React.js</span>
                <span className="badge-light-pill">TypeScript</span>
                <span className="badge-light-pill">Python</span>
                <span className="badge-light-pill">PyTorch</span>
              </div>

              <div className="intro-actions">
                <button onClick={() => setShowCard(!showCard)} className="btn-accent-outline-light">
                  {showCard ? "HIDE CARD" : "SHOW CARD"}
                </button>
                <button onClick={() => setShowAboutModal(true)} className="btn-solid-light">
                  Education & Experience
                </button>
              </div>
            </div>

            <div className="intro-right-col">
              <AnimatePresence>
                {showCard && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -40 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="intro-card-canvas-container"
                  >
                    <Suspense fallback={<div className="loading-spinner-inline">Loading 3D Card...</div>}>
                      <BandCard />
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Project <span>Work</span></h2>
            <div className="section-line"></div>
          </div>

          <div className="projects-interactive-container">
            <div className="projects-gallery-column">
              <CircularGallery
                items={projectItems}
                onChange={(index) => setActiveProjectIndex(index)}
                bend={3}
                textColor="#ffffff"
                borderRadius={0.05}
                scrollEase={0.03}
              />
            </div>
            <div className="projects-details-column">
              <AnimatePresence mode="wait">
                {projectsData.map((project) => {
                  if (project.id !== activeProjectIndex) return null;
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="glow-card project-card active-details-card"
                      onMouseMove={handleMouseMove}
                      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px' }}
                    >
                      <div>
                        <div className="project-top">
                          <span className="project-category">{project.category}</span>
                          <a href={project.github} target="_blank" rel="noreferrer" className="badge badge-primary">
                            GitHub
                          </a>
                        </div>
                        <h3 className="project-title" style={{ marginTop: '12px', fontSize: '22px' }}>{project.title}</h3>
                        <ul className="project-bullets" style={{ marginTop: '16px', maxHeight: '280px', overflowY: 'auto', paddingRight: '8px' }}>
                          {project.bullets.map((bullet, idx) => (
                            <li key={idx} className="project-bullet" style={{ fontSize: '13.5px', marginBottom: '8px', lineHeight: '1.6' }}>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="project-tech" style={{ marginTop: '20px', flexWrap: 'wrap', gap: '8px', display: 'flex' }}>
                        {project.tech.map((t, idx) => (
                          <span key={idx} className="badge" style={{ fontSize: '11px', padding: '4px 10px' }}>{t}</span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="section">
        <div className="container">
          <div className="skills-title-wrapper">
            <TextPressure
              text="TECHNICAL SKILLS"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="var(--foreground)"
              minFontSize={28}
            />
          </div>

          <div className="skills-interactive-container">
            <div className="skills-sphere-column" style={{ width: '100%' }}>
              <TechSphere />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & TIMELINE SECTION */}
      <section id="about" className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Education & <span>Experience</span></h2>
            <div className="section-line"></div>
          </div>

          <ScrollStack useWindowScroll={true} itemStackDistance={24} itemScale={0.02} itemDistance={100} stackPosition="15%" baseScale={0.92}>
            {/* Card 1: Education */}
            <ScrollStackItem itemClassName="glow-card education-card-stack" onMouseMove={handleMouseMove}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="education-icon" style={{ flexShrink: 0 }}>
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h3 className="education-title" style={{ fontSize: '24px' }}>B.Tech in Computer Science and Engineering</h3>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', marginTop: '10px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase' }}>Status</p>
                    <p className="education-status" style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginTop: '4px' }}>Currently: 3rd Year</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase' }}>Graduation</p>
                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginTop: '4px' }}>Class of 2028</p>
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            {/* Card 2: Certifications */}
            <ScrollStackItem itemClassName="glow-card certifications-card-stack" onMouseMove={handleMouseMove}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px' }}>
                  <Award size={26} /> Certifications
                </h3>
                <ul className="timeline-desc" style={{ paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <li className="timeline-bullet" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Certificate of Appreciation — SKILLiGENCE EdTech Pvt. Ltd. (Jul 2026)
                  </li>
                  <li className="timeline-bullet" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Internship Appreciation Letter — SKILLiGENCE EdTech Pvt. Ltd. (Jul 2026)
                  </li>
                </ul>
              </div>
            </ScrollStackItem>

            {/* Card 3: Experience */}
            <ScrollStackItem itemClassName="glow-card experience-card-stack" onMouseMove={handleMouseMove}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 className="education-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', marginBottom: '8px' }}>
                  <Briefcase size={24} /> Experience
                </h3>
                <div className="timeline">
                  <div className="timeline-item" style={{ marginBottom: '28px' }}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-header">
                      <h3 className="timeline-role" style={{ fontSize: '18px' }}>AI-ML Intern</h3>
                      <span className="timeline-date">20 May 2026 – 4 Jul 2026</span>
                    </div>
                    <p className="timeline-company" style={{ fontSize: '13px' }}>SKILLiGENCE EdTech Pvt. Ltd.</p>
                    <ul className="timeline-desc" style={{ marginTop: '12px' }}>
                      <li className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: '8px' }}>
                        Selected as AI-ML Intern to design and build AI/ML projects for the company over the internship period.
                      </li>
                      <li className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: '8px' }}>
                        Delivered multiple production-ready packages and source code submissions in line with internship deliverables.
                      </li>
                      <li className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: '0px' }}>
                        Completed the internship successfully and received an Internship Appreciation Letter and Certificate of Appreciation.
                      </li>
                    </ul>
                  </div>

                  <div className="timeline-item" style={{ marginBottom: '0' }}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-header">
                      <h3 className="timeline-role" style={{ fontSize: '18px' }}>Senior Coordinator</h3>
                      <span className="timeline-date">May 2025 – May 2026</span>
                    </div>
                    <p className="timeline-company" style={{ fontSize: '13px' }}>LearnIT Club</p>
                    <ul className="timeline-desc" style={{ marginTop: '12px' }}>
                      <li className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: '8px' }}>
                        Organized campus-wide hackathons, technical workshops, and coding challenges.
                      </li>
                      <li className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: '8px' }}>
                        Mentored 10+ junior members in Web Development and Machine Learning foundations.
                      </li>
                      <li className="timeline-bullet" style={{ fontSize: '13.5px', marginBottom: '0px' }}>
                        Led cross-functional teams in club management and coordinated speaker events.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header" ref={contactContainerRef} style={{ justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
            <h2 className="section-title" style={{ fontSize: '42px', textTransform: 'none', display: 'inline-block', textAlign: 'center', margin: '0 auto' }}>
              <VariableProximity
                label="Let's Connect"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 900, 'opsz' 40"
                containerRef={contactContainerRef}
                radius={120}
                falloff="linear"
              />
            </h2>
            <div className="section-line" style={{ flexGrow: 0, width: '80px', height: '2px', backgroundColor: 'var(--accent-light, #10b981)', margin: '0 auto' }}></div>
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
              <a href="https://github.com/tapasyashrestha" target="_blank" rel="noreferrer" className="outline-icon-button" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/tapasya-shrestha-8b37b9320/" target="_blank" rel="noreferrer" className="outline-icon-button" aria-label="LinkedIn">
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

      {/* ABOUT ME MODAL */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="about-modal-overlay"
            onClick={() => setShowAboutModal(false)}
          >
            {/* Back Button */}
            <button
              className="about-modal-back-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowAboutModal(false);
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="about-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="about-modal-title">
                About Me <span className="about-modal-cursor">|</span>
              </h2>

              <div className="about-modal-text-container">
                <p className="about-modal-paragraph">
                  I'm a third-year Computer Science student passionate about creating products that combine thoughtful design with powerful technology. My interests span full-stack web development, artificial intelligence, and machine learning, where I focus on building applications that are fast, scalable, and solve real-world problems. I'm always looking for opportunities to learn, innovate, and grow as a developer.
                </p>

              </div>

              <a
                href="/Tapasya_Shrestha_Resume.pdf"
                download="Tapasya_Shrestha_Resume.pdf"
                className="about-modal-download-btn"
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
