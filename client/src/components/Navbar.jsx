import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/planner', label: '✨ Plan My Trip' },
    { to: '/spots', label: 'Explore Spots' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <span className="navbar__logo-icon">🌴</span>
          <span className="navbar__logo-text">
            Goa<span className="navbar__logo-accent">Genie</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links" role="list">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                id={`nav-${link.label.toLowerCase().replace(/\W+/g, '-')}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/planner" className="navbar__cta btn btn-primary" id="nav-cta">
          Plan My Trip
        </Link>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          id="nav-hamburger"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'open' : ''}`} id="nav-mobile-menu">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar__mobile-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
