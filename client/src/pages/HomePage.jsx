import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';
import SpotCard from '../components/SpotCard';
import './HomePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const features = [
  { icon: '🤖', title: 'AI Itinerary', desc: 'Personalized day-wise travel plans powered by Groq Llama 3.3' },
  { icon: '💰', title: 'Budget Planner', desc: 'Smart budget breakdown across stays, food, transport & activities' },
  { icon: '⛅', title: 'Live Weather', desc: 'Real-time Goa weather with travel advice tailored to conditions' },
  { icon: '📍', title: 'Curated Spots', desc: '18+ handpicked beaches, forts, clubs, and hidden gems' },
  { icon: '🚗', title: 'Transport Tips', desc: 'Bike rentals, ferry routes, and local commute guidance' },
  { icon: '🌅', title: 'Goa Expertise', desc: 'Insider tips from seasoned Goa travelers and locals' },
];

const stats = [
  { value: '50+', label: 'Tourist Spots' },
  { value: '10K+', label: 'Trips Planned' },
  { value: '4.9★', label: 'User Rating' },
  { value: '100%', label: 'AI-Powered' },
];

const testimonials = [
  { name: 'Priya K.', text: 'GoaGenie planned my entire 5-day Goa trip in seconds! The itinerary was perfect — beaches, forts, and the best local restaurants.', avatar: '🧑‍🦱' },
  { name: 'Rohan M.', text: 'The budget estimation was spot-on. We stayed within ₹25,000 for the whole trip! This app is a game-changer.', avatar: '🧔' },
  { name: 'Sneha D.', text: 'Weather tips were super helpful — we avoided the rainy days and had the most amazing sunsets at Chapora Fort!', avatar: '👩' },
];

export default function HomePage() {
  const [featuredSpots, setFeaturedSpots] = useState([]);
  const [typedText, setTypedText] = useState('');
  const heroRef = useRef(null);
  const fullText = 'Your Smart Goa Travel Companion';

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Load featured spots
  useEffect(() => {
    fetch(`${API_URL}/api/spots`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Pick 3 diverse spots
          const picks = data.spots.filter(s =>
            [1, 12, 7].includes(s.id)
          );
          setFeaturedSpots(picks);
        }
      })
      .catch(() => {});
  }, []);

  // Parallax on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.setProperty('--scroll', `${window.scrollY * 0.4}px`);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="page-content">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero" ref={heroRef} id="hero">
        {/* Animated blobs */}
        <div className="hero__blob hero__blob--1" aria-hidden="true" />
        <div className="hero__blob hero__blob--2" aria-hidden="true" />
        <div className="hero__blob hero__blob--3" aria-hidden="true" />

        {/* Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="hero__particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} aria-hidden="true" />
        ))}

        <div className="hero__content container">
          <div className="hero__badge animate-fade-up">
            <span>🌴</span> Goa's #1 AI Travel Planner
          </div>
          <h1 className="hero__title animate-fade-up">
            Plan Your
            <span className="hero__title-gradient"> Dream Goa</span>
            <br />Trip in Seconds
          </h1>
          <p className="hero__subtitle animate-fade-up">
            <span className="hero__typewriter">{typedText}</span>
            <span className="hero__cursor">|</span>
          </p>
          <p className="hero__desc animate-fade-up">
            Enter your budget, days, and interests — GoaGenie's AI generates a complete
            personalized itinerary with weather insights, curated spots, and budget breakdown.
          </p>
          <div className="hero__actions animate-fade-up">
            <Link to="/planner" className="btn btn-primary hero__cta" id="hero-plan-btn">
              ✨ Start Planning Free
            </Link>
            <Link to="/spots" className="btn btn-secondary" id="hero-spots-btn">
              Explore Spots
            </Link>
          </div>

          {/* Stats strip */}
          <div className="hero__stats animate-fade-up">
            {stats.map(s => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Widget floating in hero */}
        <div className="hero__weather animate-float">
          <WeatherWidget compact />
        </div>

        {/* Wave */}
        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" fill="var(--ocean-deep)" />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How GoaGenie Works</h2>
            <p className="section-subtitle">Three simple steps to your perfect Goa vacation</p>
          </div>
          <div className="steps">
            {[
              { step: '01', icon: '📝', title: 'Tell Us Your Plans', desc: 'Enter your budget, trip duration, travel group, and interests.' },
              { step: '02', icon: '🤖', title: 'AI Does the Magic', desc: 'Groq AI generates your personalized day-by-day itinerary instantly.' },
              { step: '03', icon: '🌴', title: 'Explore & Enjoy', desc: 'Download your plan, check weather, and head to Goa!' },
            ].map((item, i) => (
              <div key={i} className="step-card glass-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
                {i < 2 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section className="section features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">Packed with features to make your Goa trip unforgettable</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SPOTS ───────────────────────────── */}
      {featuredSpots.length > 0 && (
        <section className="section featured-spots" id="featured-spots">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Goa's Must-Visit Spots</h2>
              <p className="section-subtitle">Handpicked highlights from beaches to forts</p>
            </div>
            <div className="spots-row">
              {featuredSpots.map(spot => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/spots" className="btn btn-secondary" id="see-all-spots-btn">
                See All 18+ Spots →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="section testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Loved by Travelers</h2>
            <p className="section-subtitle">Real experiences from real Goa adventurers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card glass-card">
                <div className="testimonial-stars">{'⭐'.repeat(5)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <strong>{t.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────── */}
      <section className="cta-banner" id="cta-banner">
        <div className="container">
          <div className="cta-banner__inner glass-card">
            <div className="cta-banner__content">
              <h2 className="cta-banner__title">Ready for Your Goa Adventure? 🌊</h2>
              <p className="cta-banner__subtitle">Join thousands of travelers who planned their perfect Goa trip with GoaGenie</p>
            </div>
            <Link to="/planner" className="btn btn-primary" id="cta-banner-btn">
              ✨ Plan My Trip Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__brand">
              <span className="footer__logo">🌴 GoaGenie</span>
              <p>Your Smart Goa Travel Companion</p>
            </div>
            <div className="footer__links">
              <Link to="/" id="footer-home">Home</Link>
              <Link to="/planner" id="footer-planner">Plan Trip</Link>
              <Link to="/spots" id="footer-spots">Explore Spots</Link>
            </div>
          </div>
          <div className="footer__bottom">
            <p>© 2026 GoaGenie. Made with ❤️ for the beaches of Goa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
