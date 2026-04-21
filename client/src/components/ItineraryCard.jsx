import { useState } from 'react';
import './ItineraryCard.css';

const CATEGORY_CONFIG = {
  beach: { color: 'var(--teal)', bg: 'rgba(0,180,216,0.1)', emoji: '🏖️' },
  fort: { color: 'var(--sunset-amber)', bg: 'rgba(247,147,30,0.1)', emoji: '🏰' },
  food: { color: 'var(--sunset-gold)', bg: 'rgba(255,209,102,0.1)', emoji: '🍤' },
  nightlife: { color: 'var(--sunset-pink)', bg: 'rgba(239,71,111,0.1)', emoji: '🎵' },
  nature: { color: '#4ecd6b', bg: 'rgba(78,205,107,0.1)', emoji: '🌿' },
  culture: { color: '#c77dff', bg: 'rgba(157,78,221,0.1)', emoji: '⛪' },
  shopping: { color: 'var(--teal-light)', bg: 'rgba(72,202,228,0.1)', emoji: '🛍️' },
};

function StarRating({ rating }) {
  const stars = Math.round(rating);
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`star ${i < stars ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function ItineraryCard({ day, onSpotClick }) {
  const [expanded, setExpanded] = useState(null);

  if (!day) return null;

  const toggleActivity = (i) => setExpanded(prev => prev === i ? null : i);

  return (
    <div className="itinerary-card animate-fade">
      {/* Day Header */}
      <div className="itinerary-header glass-card">
        <div className="itinerary-header__left">
          <div className="day-badge">Day {day.day}</div>
          <div>
            <h2 className="day-title">{day.title}</h2>
            <span className="day-theme">🎯 {day.theme}</span>
          </div>
        </div>
        <div className="day-meta">
          <div className="day-budget-display">
            <span className="day-budget-label">Day Budget</span>
            <span className="day-budget-value">₹{day.dayBudget?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="activities-timeline">
        {day.activities?.map((activity, i) => {
          const config = CATEGORY_CONFIG[activity.category] || CATEGORY_CONFIG.beach;
          const isOpen = expanded === i;

          return (
            <div
              key={i}
              className={`activity-item ${isOpen ? 'open' : ''}`}
              style={{ '--cat-color': config.color, '--cat-bg': config.bg }}
            >
              {/* Timeline dot */}
              <div className="timeline-dot">
                <span className="timeline-dot__inner">{config.emoji}</span>
              </div>

              {/* Activity content */}
              <div className="activity-card glass-card" onClick={() => toggleActivity(i)} id={`activity-${day.day}-${i}`}>
                <div className="activity-header">
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-info">
                    <h3 
                      className="activity-place clickable" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpotClick?.(activity.place);
                      }}
                    >
                      {activity.place}
                    </h3>
                    <div className="activity-meta-row">
                      <span className={`badge badge-${activity.category}`}>{activity.category}</span>
                      <span className="activity-duration">⏱ {activity.duration}</span>
                      <span className="activity-cost">💰 {activity.estimatedCost}</span>
                    </div>
                  </div>
                  <div className="activity-chevron">{isOpen ? '▲' : '▼'}</div>
                </div>

                {isOpen && (
                  <div className="activity-body animate-fade">
                    <p className="activity-desc">{activity.description}</p>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ marginTop: '1rem', width: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpotClick?.(activity.place);
                      }}
                    >
                      📍 Show on Map
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Meals Section */}
      {day.meals && (
        <div className="meals-section glass-card">
          <h3 className="meals-title">🍽️ Today's Meals</h3>
          <div className="meals-grid">
            {Object.entries(day.meals).map(([mealType, meal]) => (
              <div 
                key={mealType} 
                className="meal-card clickable"
                onClick={() => onSpotClick?.(meal.place)}
              >
                <div className="meal-type">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
                <div className="meal-place">{meal.place}</div>
                <div className="meal-dish">{meal.dish}</div>
                <div className="meal-cost">{meal.cost}</div>
                <div className="meal-map-hint">📍 Click for Map</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transport + Tip */}
      <div className="day-footer">
        {day.transport && (
          <div className="transport-card glass-card">
            <span className="transport-icon">🚗</span>
            <div>
              <div className="transport-label">Getting Around</div>
              <div className="transport-text">{day.transport}</div>
            </div>
          </div>
        )}
        {day.tip && (
          <div className="tip-card glass-card">
            <span className="tip-icon">💡</span>
            <div>
              <div className="tip-label">Insider Tip</div>
              <div className="tip-text">{day.tip}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
