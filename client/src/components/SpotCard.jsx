import { useState } from 'react';
import SpotModal from './SpotModal';
import './SpotCard.css';

const CATEGORY_EMOJI = {
  beach: '🏖️', fort: '🏰', nightlife: '🎵',
  nature: '🌿', food: '🍤', culture: '⛪',
};

const AREA_COLORS = {
  'North Goa': 'var(--teal)',
  'South Goa': 'var(--sunset-amber)',
  'Old Goa': '#c77dff',
  'East Goa': '#4ecd6b',
  'Panaji': 'var(--teal-light)',
  'Chorao Island': 'var(--sunset-gold)',
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="spot-stars" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'star' : i === full && half ? 'star half' : 'star empty'}>
          {i < full ? '★' : i === full && half ? '⯨' : '★'}
        </span>
      ))}
      <span className="spot-rating-num">{rating}</span>
    </div>
  );
}

export default function SpotCard({ spot }) {
  const [showModal, setShowModal] = useState(false);
  const emoji = CATEGORY_EMOJI[spot.category] || '📍';
  const areaColor = AREA_COLORS[spot.area] || 'var(--teal)';

  return (
    <>
    <article
      className={`spot-card glass-card spot-card--${spot.category}`}
      id={`spot-card-${spot.id}`}
    >
      {/* Category banner */}
      <div className="spot-card__banner" style={{ '--cat-color': areaColor }}>
        <span className="spot-banner__emoji">{emoji}</span>
        <div className="spot-banner__right">
          <span className={`badge badge-${spot.category}`}>{spot.category}</span>
          <span className="spot-area" style={{ color: areaColor }}>{spot.area}</span>
        </div>
      </div>

      {/* Content */}
      <div className="spot-card__body">
        <h3 className="spot-name">{spot.name}</h3>
        <Stars rating={spot.rating} />
        <p className="spot-desc">{spot.description}</p>

        {/* Highlights */}
        <div className="spot-highlights">
          {spot.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="highlight-tag">{h}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="spot-card__footer">
          <div className="spot-meta">
            <span className="spot-meta-item">🎫 {spot.entryFee}</span>
            <span className="spot-meta-item">📅 {spot.bestTime}</span>
          </div>
          <button 
            className="btn btn-sm btn-secondary spot-map-btn"
            onClick={() => setShowModal(true)}
          >
            Track Location 🗺️
          </button>
        </div>
      </div>
    </article>
    {showModal && <SpotModal spot={spot} onClose={() => setShowModal(false)} />}
    </>
  );
}
