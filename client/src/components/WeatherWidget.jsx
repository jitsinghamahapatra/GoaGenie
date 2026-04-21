import { useEffect, useState } from 'react';
import './WeatherWidget.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WEATHER_ICONS = {
  clear: '☀️', sunny: '☀️', cloud: '⛅', overcast: '☁️',
  rain: '🌧️', storm: '⛈️', drizzle: '🌦️', fog: '🌫️', wind: '💨',
};

function getWeatherIcon(phrase = '') {
  const p = phrase.toLowerCase();
  if (p.includes('storm') || p.includes('thunder')) return '⛈️';
  if (p.includes('rain') || p.includes('shower')) return '🌧️';
  if (p.includes('drizzle')) return '🌦️';
  if (p.includes('fog') || p.includes('mist')) return '🌫️';
  if (p.includes('overcast') || p.includes('cloudy')) return '☁️';
  if (p.includes('partly') || p.includes('cloud')) return '⛅';
  if (p.includes('clear') || p.includes('sunny')) return '☀️';
  return '🌤️';
}

export default function WeatherWidget({ compact = false }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/weather`)
      .then(r => r.json())
      .then(data => { if (data.success) setWeather(data.weather); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`weather-widget glass-card ${compact ? 'compact' : ''}`} id="weather-widget">
        <div className="weather-skeleton">
          <div className="skeleton" style={{ width: '60%', height: '20px' }} />
          <div className="skeleton" style={{ width: '40%', height: '40px', marginTop: 8 }} />
          <div className="skeleton" style={{ width: '80%', height: '16px', marginTop: 8 }} />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const icon = getWeatherIcon(weather.symbolPhrase);

  if (compact) {
    return (
      <div className="weather-widget weather-widget--compact glass-card" id="weather-widget-compact">
        <div className="weather-compact__top">
          <span className="weather-icon-lg">{icon}</span>
          <div>
            <div className="weather-temp-lg">{weather.temperature}°C</div>
            <div className="weather-location">📍 {weather.location}</div>
          </div>
        </div>
        <div className="weather-phrase">{weather.symbolPhrase}</div>
        <div className="weather-advice">{weather.advice}</div>
      </div>
    );
  }

  return (
    <div className="weather-widget glass-card" id="weather-widget-full">
      <div className="weather-header">
        <div className="weather-location-row">
          <span className="weather-pin">📍</span>
          <span className="weather-location-name">{weather.location}</span>
          {weather.isFallback && <span className="weather-fallback-badge">Demo</span>}
        </div>
        <div className="weather-updated">Live Weather</div>
      </div>

      {/* Main temp display */}
      <div className="weather-main">
        <span className="weather-icon-xl">{icon}</span>
        <div>
          <div className="weather-temp-xl">{weather.temperature}°C</div>
          <div className="weather-feels">Feels like {weather.feelsLike}°C</div>
          <div className="weather-condition">{weather.symbolPhrase}</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="weather-stats">
        <div className="weather-stat">
          <span className="weather-stat__icon">💧</span>
          <span className="weather-stat__value">{weather.humidity}%</span>
          <span className="weather-stat__label">Humidity</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__icon">💨</span>
          <span className="weather-stat__value">{weather.windSpeed} km/h</span>
          <span className="weather-stat__label">Wind {weather.windDir}</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__icon">👁️</span>
          <span className="weather-stat__value">{weather.visibility} km</span>
          <span className="weather-stat__label">Visibility</span>
        </div>
      </div>

      {/* Advice */}
      <div className="weather-advice-box">
        {weather.advice}
      </div>
    </div>
  );
}
