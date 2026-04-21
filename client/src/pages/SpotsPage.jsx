import { useState, useEffect } from 'react';
import SpotCard from '../components/SpotCard';
import './SpotsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🗺️' },
  { id: 'beach', label: 'Beaches', icon: '🏖️' },
  { id: 'fort', label: 'Forts', icon: '🏰' },
  { id: 'nightlife', label: 'Nightlife', icon: '🎵' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'food', label: 'Food', icon: '🍤' },
  { id: 'culture', label: 'Culture', icon: '⛪' },
];

export default function SpotsPage() {
  const [spots, setSpots] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/spots`)
      .then(r => r.json())
      .then(data => { if (data.success) { setSpots(data.spots); setFiltered(data.spots); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = spots;
    if (category !== 'all') result = result.filter(s => s.category === category);
    if (search) result = result.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.area.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [category, search, spots]);

  return (
    <div className="page-content spots-page">
      {/* Header */}
      <div className="spots-header">
        <div className="container">
          <h1 className="spots-title">Explore Goa's Best Spots 🗺️</h1>
          <p className="spots-subtitle">18+ handpicked beaches, forts, clubs, nature escapes, and hidden gems</p>

          {/* Search */}
          <div className="spots-search">
            <span className="search-icon">🔍</span>
            <input
              id="spots-search-input"
              type="text"
              className="search-input"
              placeholder="Search spots, areas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')} id="spots-search-clear">✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container spots-body">
        {/* Category Filter */}
        <div className="category-filter">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-btn ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
              id={`cat-btn-${cat.id}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="spots-count">
          Showing <strong>{filtered.length}</strong> spot{filtered.length !== 1 ? 's' : ''}
          {category !== 'all' ? ` in ${CATEGORIES.find(c => c.id === category)?.label}` : ''}
          {search ? ` matching "${search}"` : ''}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spots-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card spot-skeleton">
                <div className="skeleton" style={{ height: '80px', borderRadius: '12px 12px 0 0' }} />
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: '20px', width: '70%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '40%' }} />
                  <div className="skeleton" style={{ height: '60px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="spots-grid">
            {filtered.map(spot => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="spots-empty">
            <span className="spots-empty__icon">🔍</span>
            <h3>No spots found</h3>
            <p>Try a different category or search term</p>
            <button className="btn btn-secondary" onClick={() => { setCategory('all'); setSearch(''); }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
