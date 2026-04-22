import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import WeatherWidget from '../components/WeatherWidget';
import SpotCard from '../components/SpotCard';
import './HomePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function HomePage() {
  const [featuredSpots, setFeaturedSpots] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/spots`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setFeaturedSpots(data.spots.slice(0, 3));
        }
      });

    const visitorRef = ref(db, 'stats/userCount');
    const unsubscribe = onValue(visitorRef, (snapshot) => {
      setVisitorCount(snapshot.val() || 0);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="home-page">
      {/* ─── HERO SECTION ──────────────────────────── */}
      <section className="hero">
        <div className="hero__water-bg">
          <img src="/goa_ocean_minimalist_1776750130676.png" alt="Water Background" />
          <div className="hero__overlay"></div>
          {/* Waves Animation */}
          <div className="waves-container">
            <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
              <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
              </defs>
              <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(14, 165, 233, 0.7)" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(14, 165, 233, 0.5)" />
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(14, 165, 233, 0.3)" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--bg-primary)" />
              </g>
            </svg>
          </div>
        </div>
        
        <div className="container hero__container">
          <div className="hero__content animate-fade-up">
            <div className="hero__badge">Goa's #1 AI Planner</div>
            <h1 className="hero__title">
              Plan your dream <br/>
              <span className="hero__highlight">Goa vacation</span>
            </h1>
            <p className="hero__desc">
              Your smart travel companion. AI-powered itineraries, real-time weather, 
              and handpicked local gems.
            </p>
            <div className="hero__actions">
              <Link to="/planner" className="btn btn-primary">Start Planning — Free</Link>
              <Link to="/spots" className="btn btn-ghost">Explore Spots</Link>
            </div>
            <div className="hero__stats">
              <div className="stat">
                <span className="stat__val">{visitorCount}+</span>
                <span className="stat__label">Travelers</span>
              </div>
              <div className="stat">
                <span className="stat__val">50+</span>
                <span className="stat__label">Spots</span>
              </div>
            </div>
          </div>

          <div className="hero__visual animate-fade">
             <WeatherWidget />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────── */}
      <section className="section features-section">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-subtitle">Simplified travel planning for the modern explorer.</p>
          </header>

          <div className="grid-4 features-grid">
            <div className="feature-card card">
              <div className="feature-icon">🤖</div>
              <h3>AI Itineraries</h3>
              <p>Personalized day-wise plans based on your interests and budget.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🌦️</div>
              <h3>Smart Weather</h3>
              <p>Real-time forecasts and travel warnings for your trip duration.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">📍</div>
              <h3>Smart Routes</h3>
              <p>Get directions from your location to any spot in your itinerary.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🗣️</div>
              <h3>Local Translator</h3>
              <p>Speak in English or Hindi and translate instantly to local Konkani.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED SPOTS ────────────────────────── */}
      <section className="section spots-section bg-accent">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Explore the most loved beaches and landmarks.</p>
          </header>

          <div className="grid-3">
            {featuredSpots.map(spot => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
          
          <div className="flex-center" style={{ marginTop: '3rem' }}>
            <Link to="/spots" className="btn btn-secondary">View All Spots →</Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card card flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 className="section-title">Ready for your Goa adventure?</h2>
            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
              Join thousands of travelers using GoaGenie to plan better.
            </p>
            <Link to="/planner" className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem' }}>
              Plan My Trip Now
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2026 GoaGenie. Your smart travel guide.</p>
        </div>
      </footer>
    </div>
  );
}
