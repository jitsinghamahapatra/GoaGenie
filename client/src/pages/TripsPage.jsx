import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import './TripsPage.css';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const tripsRef = ref(db, `users/${user.uid}/trips`);
    const unsubscribe = onValue(tripsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tripList = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setTrips(tripList);
      } else {
        setTrips([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await remove(ref(db, `users/${user.uid}/trips/${tripId}`));
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete trip');
    }
  };

  if (loading) return (
    <div className="page-content flex-center">
      <div className="spinner"></div>
    </div>
  );

  if (!user) return (
    <div className="page-content container flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
      <h2>Please Login to View Your Trips</h2>
      <Link to="/login" className="btn btn-primary">Go to Login</Link>
    </div>
  );

  return (
    <div className="page-content trips-page">
      <div className="container">
        <header className="trips-header animate-fade-up">
          <h1 className="section-title">My Saved Trips ✈️</h1>
          <p className="section-subtitle">Manage your past itineraries and travel plans</p>
        </header>

        {trips.length === 0 ? (
          <div className="no-trips glass-card animate-fade-up">
            <div className="no-trips__icon">🏝️</div>
            <h3>No trips saved yet</h3>
            <p>Your dream Goa vacation is just a few clicks away!</p>
            <Link to="/planner" className="btn btn-primary">Plan Your First Trip</Link>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div key={trip.id} className="trip-card glass-card animate-fade-up">
                <div className="trip-card__header">
                  <span className="trip-date">
                    {new Date(trip.timestamp).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                    })}
                  </span>
                  <div className="trip-badge">
                    {trip.formDetails.days} Days • {trip.formDetails.groupType}
                  </div>
                </div>
                
                <h3 className="trip-title">{trip.itinerary.tripSummary.split('.')[0]}</h3>
                
                <div className="trip-details">
                  <div className="trip-detail">
                    <span>💰 Budget</span>
                    <strong>₹{trip.formDetails.budget.toLocaleString()}</strong>
                  </div>
                  <div className="trip-detail">
                    <span>🏨 Stay</span>
                    <strong>{trip.formDetails.accommodation}</strong>
                  </div>
                </div>

                <div className="trip-actions">
                  <Link to={`/planner?tripId=${trip.id}`} className="btn btn-secondary btn-sm">
                    View Plan
                  </Link>
                  <button 
                    className="btn btn-ghost btn-sm btn-delete" 
                    onClick={() => deleteTrip(trip.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
