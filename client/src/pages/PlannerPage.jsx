import { useState } from 'react';
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
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);

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
  };

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
              <button className="btn btn-ghost" onClick={reset} id="planner-reset-btn">
                ← Plan Another Trip
              </button>
            </div>
          </div>
        </div>

        <div className="container results-body">
          {/* Budget + Weather sidebar */}
          <aside className="results-sidebar">
            <BudgetSummary budget={result.totalBudgetEstimate} />
            <WeatherWidget />
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
            {/* Transport Tips */}
            {result.transportTips && (
              <div className="glass-card sidebar-card">
                <h3 className="sidebar-card__title">🚗 Transport Tips</h3>
                <ul className="transport-list">
                  {result.transportTips.map((tip, i) => (
                    <li key={i} className="transport-tip">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Emergency */}
            {result.emergencyContacts && (
              <div className="glass-card sidebar-card emergency-card">
                <h3 className="sidebar-card__title">🆘 Emergency Contacts</h3>
                <div className="emergency-list">
                  <div className="emergency-item"><span>Police</span><strong>{result.emergencyContacts.police}</strong></div>
                  <div className="emergency-item"><span>Ambulance</span><strong>{result.emergencyContacts.ambulance}</strong></div>
                  <div className="emergency-item"><span>Tourist Helpline</span><strong>{result.emergencyContacts.touristHelpline}</strong></div>
                </div>
              </div>
            )}
          </aside>

          {/* Day tabs + cards */}
          <main className="results-main">
            <div className="day-tabs">
              {result.days.map((d, i) => (
                <button
                  key={i}
                  className={`day-tab ${activeDay === i ? 'active' : ''}`}
                  onClick={() => setActiveDay(i)}
                  id={`day-tab-${i + 1}`}
                >
                  <span className="day-tab__num">Day {d.day}</span>
                  <span className="day-tab__theme">{d.theme}</span>
                </button>
              ))}
            </div>

            <ItineraryCard day={result.days[activeDay]} />
          </main>
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
          <div className="loading-steps">
            {['Analyzing your preferences...', 'Selecting best spots...', 'Building day-wise plan...', 'Estimating budget...'].map((s, i) => (
              <div key={i} className="loading-step" style={{ animationDelay: `${i * 0.5}s` }}>
                <span className="loading-step__dot" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ─────────────────────────────────
  return (
    <div className="page-content planner-page">
      {/* Header */}
      <div className="planner-header">
        <div className="container">
          <h1 className="planner-title">Plan Your Goa Trip ✨</h1>
          <p className="planner-subtitle">Fill in your preferences and let AI do the magic</p>
        </div>
      </div>

      <div className="container planner-body">
        <div className="planner-form-wrap">
          {/* Progress bar */}
          <div className="progress-bar">
            {STEPS.slice(0, 3).map((s, i) => (
              <div key={i} className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="progress-step__dot">{i < step ? '✓' : i + 1}</div>
                <span className="progress-step__label">{s}</span>
              </div>
            ))}
          </div>

          {/* STEP 0 — Details */}
          {step === 0 && (
            <div className="form-step glass-card animate-fade-up" id="step-details">
              <h2 className="form-step__title">👋 Tell Us About Your Group</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="group-type">Group Type</label>
                  <select
                    id="group-type"
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
                  <label className="form-label" htmlFor="accommodation">Accommodation</label>
                  <select
                    id="accommodation"
                    className="form-select"
                    value={form.accommodation}
                    onChange={e => setForm(f => ({ ...f, accommodation: e.target.value }))}
                  >
                    <option value="budget guesthouse">🏠 Budget Guesthouse (₹500–₹1500/night)</option>
                    <option value="mid-range hotel">🏨 Mid-Range Hotel (₹1500–₹4000/night)</option>
                    <option value="luxury resort">🏖️ Luxury Beach Resort (₹4000+/night)</option>
                    <option value="airbnb villa">🏡 Airbnb / Private Villa</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary form-next" onClick={() => setStep(1)} id="step-0-next">
                Next: Budget & Days →
              </button>
            </div>
          )}

          {/* STEP 1 — Budget & Days */}
          {step === 1 && (
            <div className="form-step glass-card animate-fade-up" id="step-budget">
              <h2 className="form-step__title">💰 Budget & Trip Duration</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="trip-days">Number of Days</label>
                <div className="day-picker">
                  {[2, 3, 4, 5, 6, 7].map(d => (
                    <button
                      key={d}
                      className={`day-btn ${form.days === d ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, days: d }))}
                      id={`day-btn-${d}`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budget-input">
                  Total Budget: <span className="budget-value">₹{form.budget.toLocaleString()}</span>
                </label>
                <input
                  id="budget-input"
                  type="range"
                  className="budget-slider"
                  min={3000}
                  max={100000}
                  step={500}
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: parseInt(e.target.value) }))}
                />
                <div className="budget-range-labels">
                  <span>₹3,000</span>
                  <span>₹1,00,000</span>
                </div>
                <div className="budget-presets">
                  {[5000, 10000, 25000, 50000].map(p => (
                    <button
                      key={p}
                      className={`preset-btn ${form.budget === p ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, budget: p }))}
                      id={`budget-preset-${p}`}
                    >
                      ₹{(p / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              <div className="budget-info glass-card">
                <span>📊 Approx ₹{Math.round(form.budget / form.days).toLocaleString()} per day for {form.days} days</span>
              </div>

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setStep(0)} id="step-1-back">← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)} id="step-1-next">Next: Interests →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Interests */}
          {step === 2 && (
            <div className="form-step glass-card animate-fade-up" id="step-interests">
              <h2 className="form-step__title">🎯 What Are You Into?</h2>
              <p className="form-step__desc">Select all that apply — AI will tailor your itinerary</p>

              {error && <div className="form-error">{error}</div>}

              <div className="interests-grid">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.id}
                    className={`interest-btn ${form.interests.includes(interest.id) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest.id)}
                    id={`interest-${interest.id}`}
                  >
                    <span className="interest-label">{interest.label}</span>
                    <span className="interest-desc">{interest.desc}</span>
                    {form.interests.includes(interest.id) && <span className="interest-check">✓</span>}
                  </button>
                ))}
              </div>

              <div className="selected-count">
                {form.interests.length} interest{form.interests.length !== 1 ? 's' : ''} selected
              </div>

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setStep(1)} id="step-2-back">← Back</button>
                <button
                  className="btn btn-primary generate-btn"
                  onClick={handleGenerate}
                  disabled={form.interests.length === 0}
                  id="generate-itinerary-btn"
                >
                  🤖 Generate My Itinerary
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Weather Panel */}
        <aside className="planner-sidebar">
          <WeatherWidget />
          <div className="glass-card planner-tips">
            <h3>💡 Quick Tips</h3>
            <ul>
              <li>Best time to visit: <strong>November–March</strong></li>
              <li>Renting a bike saves ₹500–₹1000/day vs taxis</li>
              <li>Book beach shacks early for dinner at peak season</li>
              <li>Carry cash — many local spots don't accept cards</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
