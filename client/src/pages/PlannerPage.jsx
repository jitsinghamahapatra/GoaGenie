import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, push, set, get } from 'firebase/database';
import { useAuth } from '../AuthContext';
import { useLocation } from 'react-router-dom';
import MapContainer from '../components/MapContainer';
import ItineraryCard from '../components/ItineraryCard';
import BudgetSummary from '../components/BudgetSummary';
import WeatherWidget from '../components/WeatherWidget';
import './PlannerPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INTERESTS = [
  { id: 'beaches', label: '🏖️ Beaches', desc: 'Sun, sand, and waves' },
  { id: 'forts', label: '🏰 Forts & History', desc: 'Portuguese heritage' },
  { id: 'nightlife', label: '🎵 Nightlife', desc: 'Clubs and beach parties' },
  { id: 'nature', label: '🌿 Nature', desc: 'Waterfalls and wildlife' },
  { id: 'food', label: '🍤 Seafood', desc: 'Goan cuisine & shacks' },
  { id: 'culture', label: '⛪ Culture', desc: 'Churches and markets' },
  { id: 'watersports', label: '🏄 Water Sports', desc: 'Parasailing and diving' },
  { id: 'shopping', label: '🛍️ Shopping', desc: 'Flea markets and boutiques' },
];

const STEPS = ['Your Details', 'Budget & Days', 'Interests', 'Generating...'];

export default function PlannerPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    groupType: 'couple',
    accommodation: 'mid-range hotel',
    days: 3,
    budget: 15000,
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [allSpots, setAllSpots] = useState([]);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [routingTarget, setRoutingTarget] = useState(null);
  const { user } = useAuth();

  const location = useLocation();

  useEffect(() => {
    // Fetch forecast for warnings
    fetch(`${API_URL}/api/weather`)
      .then(r => r.json())
      .then(data => setWeather(data))
      .catch(() => {});

    // Fetch all spots for map markers
    fetch(`${API_URL}/api/spots`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setAllSpots(data.spots);
      })
      .catch(() => {});

    // Check for tripId in URL
    const query = new URLSearchParams(location.search);
    const tripId = query.get('tripId');
    if (tripId && user) {
      const tripRef = ref(db, `users/${user.uid}/trips/${tripId}`);
      get(tripRef).then(snapshot => {
        if (snapshot.exists()) {
          const tripData = snapshot.val();
          setForm(tripData.formDetails);
          setResult(tripData.itinerary);
          setSaved(true);
        }
      });
    }
  }, [location.search, user]);

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : [...f.interests, id]
    }));
  };

  const handleGenerate = async () => {
    if (form.interests.length === 0) {
      setError('Please select at least one interest!');
      return;
    }
    setError('');
    setLoading(true);
    setStep(3);

    try {
      const res = await fetch(`${API_URL}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.itinerary);
        setActiveDay(0);
      } else {
        setError(data.error || 'Failed to generate itinerary');
        setStep(2);
      }
    } catch (err) {
      setError('Could not connect to server. Make sure the server is running.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setStep(0);
    setError('');
    setForm({ groupType: 'couple', accommodation: 'mid-range hotel', days: 3, budget: 15000, interests: [] });
    setSaved(false);
  };

  const saveTrip = async () => {
    if (!user) {
      setError('Please login to save your trip!');
      return;
    }
    setSaving(true);
    try {
      const tripsRef = ref(db, `users/${user.uid}/trips`);
      const newTripRef = push(tripsRef);
      await set(newTripRef, {
        id: newTripRef.key,
        timestamp: Date.now(),
        formDetails: form,
        itinerary: result
      });
      setSaved(true);
    } catch (err) {
      console.error('Save Trip Error:', err);
      setError('Failed to save trip. Try again!');
    } finally {
      setSaving(false);
    }
  };

  const handleSpotClick = async (spotName) => {
    try {
      // Try to find coordinates for the spot name
      const res = await fetch(`${API_URL}/api/spots?name=${encodeURIComponent(spotName)}`);
      const data = await res.json();
      
      if (data.success && data.spots.length > 0) {
        setRoutingTarget(data.spots[0]);
        // Scroll map into view
        document.getElementById('map-container')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback: Open in Google Maps directly
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotName + ' Goa')}`, '_blank');
      }
    } catch (err) {
      console.error('Match Spot Error:', err);
    }
  };

  const hasBadWeather = weather?.forecast?.slice(0, form.days).some(d => d.isBad);

  // ── RESULT VIEW ───────────────────────────────
  if (result) {
    return (
      <div className="page-content planner-results">
        <div className="results-header">
          <div className="container">
            <div className="results-header__inner">
              <div>
                <h1 className="results-title">Your Goa Itinerary is Ready! 🌴</h1>
                <p className="results-subtitle">{result.tripSummary}</p>
              </div>
              <div className="results-header__actions">
                <button 
                  className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`} 
                  onClick={saveTrip}
                  disabled={saving || saved}
                >
                  {saving ? 'Saving...' : saved ? '✅ Saved to Profile' : '💾 Save Trip'}
                </button>
                <button className="btn btn-ghost" onClick={reset} id="planner-reset-btn">
                  ← Plan Another Trip
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container results-body">
          {/* Weather Warning Banner */}
          {hasBadWeather && (
            <div className="weather-warning-banner animate-fade-up">
              <span className="warning-icon">⚠️</span>
              <div className="warning-content">
                <h3>Bad Weather Detected!</h3>
                <p>We see rain or storms in the forecast for your chosen duration. You might want to consider changing your travel dates or planning more indoor activities.</p>
              </div>
            </div>
          )}

          <div className="results-layout">
            {/* Budget + Weather sidebar */}
            <aside className="results-sidebar">
              <BudgetSummary budget={result.totalBudgetEstimate} />
              <WeatherWidget showForecast={true} daysToShow={form.days} />
              
              {/* Packing List */}
              {result.packingList && (
                <div className="glass-card sidebar-card">
                  <h3 className="sidebar-card__title">🎒 Packing List</h3>
                  <ul className="packing-list">
                    {result.packingList.map((item, i) => (
                      <li key={i} className="packing-item">
                        <span className="packing-check">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* Day tabs + cards */}
            <main className="results-main">
              <div className="day-tabs">
                {result.days.map((day, i) => (
                  <button 
                    key={i} 
                    className={`day-tab ${activeDay === i ? 'active' : ''}`}
                    onClick={() => setActiveDay(i)}
                  >
                    <span className="day-tab__num">Day {day.day}</span>
                    <span className="day-tab__theme">{day.theme}</span>
                  </button>
                ))}
              </div>

              <ItineraryCard 
                day={result.days[activeDay]} 
                onSpotClick={handleSpotClick}
              />
              
              {/* Map View */}
              <div id="map-container" className="results-map animate-fade" style={{ marginTop: '3rem' }}>
                <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  <h2 className="section-title" style={{ fontSize: '1.5rem' }}>📍 Travel Map</h2>
                  <p className="section-subtitle">Visualize your day and get directions</p>
                </div>
                <MapContainer spots={allSpots} routingTarget={routingTarget} />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING VIEW ──────────────────────────────
  if (loading) {
    return (
      <div className="page-content planner-loading">
        <div className="loading-content glass-card">
          <div className="loading-icon">🤖</div>
          <h2 className="loading-title">GoaGenie is Crafting Your Perfect Trip...</h2>
          <p className="loading-subtitle">Our AI is analyzing your preferences and building a personalized Goa itinerary</p>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ─────────────────────────────────
  return (
    <div className="page-content planner-page">
      <div className="planner-header">
        <div className="container">
          <h1 className="planner-title">Plan Your Goa Trip ✨</h1>
          <p className="planner-subtitle">Fill in your preferences and let AI do the magic</p>
        </div>
      </div>

      <div className="container planner-body">
        <div className="planner-form-wrap">
          <div className="progress-bar">
            {STEPS.slice(0, 3).map((s, i) => (
              <div key={i} className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="progress-step__dot">{i < step ? '✓' : i + 1}</div>
                <span className="progress-step__label">{s}</span>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="form-step glass-card animate-fade-up">
              <h2 className="form-step__title">👋 Tell Us About Your Group</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Group Type</label>
                  <select
                    className="form-select"
                    value={form.groupType}
                    onChange={e => setForm(f => ({ ...f, groupType: e.target.value }))}
                  >
                    <option value="solo">🧍 Solo Traveler</option>
                    <option value="couple">👫 Couple</option>
                    <option value="family">👨‍👩‍👧 Family</option>
                    <option value="friends">👯 Friends Group</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Accommodation</label>
                  <select
                    className="form-select"
                    value={form.accommodation}
                    onChange={e => setForm(f => ({ ...f, accommodation: e.target.value }))}
                  >
                    <option value="budget guesthouse">🏠 Budget Guesthouse</option>
                    <option value="mid-range hotel">🏨 Mid-Range Hotel</option>
                    <option value="luxury resort">🏖️ Luxury Beach Resort</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary form-next" onClick={() => setStep(1)}>Next: Budget & Days →</button>
            </div>
          )}

          {step === 1 && (
            <div className="form-step glass-card animate-fade-up">
              <h2 className="form-step__title">💰 Budget & Trip Duration</h2>
              <div className="form-group">
                <label className="form-label">Number of Days</label>
                <div className="day-picker">
                  {[2, 3, 4, 5, 6, 7].map(d => (
                    <button
                      key={d}
                      className={`day-btn ${form.days === d ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, days: d }))}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="budget-header">
                  <label className="form-label">Total Budget</label>
                  <span className="budget-value">₹{form.budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  className="budget-slider"
                  min={5000}
                  max={100000}
                  step={1000}
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: parseInt(e.target.value) }))}
                />
                <div className="budget-labels">
                  <span className={form.budget < 20000 ? 'active' : ''}>Economy</span>
                  <span className={form.budget >= 20000 && form.budget < 50000 ? 'active' : ''}>Standard</span>
                  <span className={form.budget >= 50000 ? 'active' : ''}>Luxury</span>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Interests →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step glass-card animate-fade-up">
              <h2 className="form-step__title">🎯 What Are You Into?</h2>
              {error && <div className="form-error">{error}</div>}
              <div className="interests-grid">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.id}
                    className={`interest-btn ${form.interests.includes(interest.id) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary generate-btn" onClick={handleGenerate}>🤖 Generate My Itinerary</button>
              </div>
            </div>
          )}
        </div>

        <aside className="planner-sidebar">
          <WeatherWidget showForecast={true} daysToShow={form.days} />
          <div className="glass-card planner-tips">
            <h3>💡 Travel Warnings</h3>
            {hasBadWeather ? (
              <p style={{ color: 'var(--sunset-orange)', fontWeight: '700' }}>
                ⚠️ Warning: Rainy weather detected in the next few days. We recommend packing an umbrella and checking for indoor events!
              </p>
            ) : (
              <p>☀️ Weather looks great for your trip! Enjoy the beaches.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
