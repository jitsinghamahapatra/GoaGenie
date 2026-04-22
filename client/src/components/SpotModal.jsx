import { useEffect, useState } from 'react';
import MapContainer from './MapContainer';
import './SpotModal.css';

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default function SpotModal({ spot, onClose }) {
  const [distance, setDistance] = useState(null);
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    if (navigator.geolocation && spot.coordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLoc({ lat, lng: lon });
          const dist = getDistanceFromLatLonInKm(
            lat, lon, 
            spot.coordinates.lat, spot.coordinates.lng
          );
          setDistance(dist.toFixed(1));
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, [spot]);

  if (!spot) return null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}`;

  return (
    <div className="spot-modal-overlay" onClick={onClose}>
      <div className="spot-modal-content animate-fade-up" onClick={e => e.stopPropagation()}>
        <button className="spot-modal-close" onClick={onClose}>✕</button>
        
        <div className="spot-modal-header">
          <h2>{spot.name}</h2>
          <p className="spot-area">{spot.area}</p>
        </div>

        <div className="spot-modal-map">
          <MapContainer spots={[spot]} routingTarget={spot} />
        </div>

        <div className="spot-modal-footer">
          <div className="distance-info">
            {distance ? (
              <p>📍 <strong>{distance} km</strong> away from you</p>
            ) : (
              <p>📍 Calculating distance...</p>
            )}
          </div>
          
          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            Open in Google Maps 🗺️
          </a>
        </div>
      </div>
    </div>
  );
}
