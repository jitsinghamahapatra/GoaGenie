import { useState, useEffect } from 'react';
import './WeatherWidget.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function WeatherWidget({ compact = false, showForecast = false, daysToShow = 3 }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/weather`)
      .then(r => r.json())
      .then(data => setWeather(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="weather-skeleton glass-card">Loading weather...</div>;
  if (!weather || !weather.current) return null;

  const { current, forecast } = weather;

  return (
    <div className={`weather-widget glass-card ${compact ? 'compact' : ''}`}>
      <div className="weather-main">
        <div className="weather-temp-section">
          <img 
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`} 
            alt={current.condition}
            className="weather-icon"
          />
          <div className="weather-temp">
            <span className="temp-value">{current.temp}°C</span>
            <span className="temp-city">{weather.city}</span>
          </div>
        </div>
        <div className="weather-info">
          <p className="weather-desc">{current.description}</p>
          {!compact && (
            <div className="weather-stats">
              <span>💧 {current.humidity}%</span>
              <span>💨 {current.windSpeed}m/s</span>
            </div>
          )}
        </div>
      </div>

      {showForecast && forecast && (
        <div className="weather-forecast">
          {forecast.slice(1, daysToShow + 1).map((day, i) => (
            <div key={i} className={`forecast-day ${day.isBad ? 'bad' : ''}`}>
              <span className="forecast-date">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt={day.condition} />
              <span className="forecast-temp">{day.temp}°C</span>
              {day.isBad && <span className="bad-dot">⚠️</span>}
            </div>
          ))}
        </div>
      )}

      {current.isBad && !compact && (
        <div className="weather-warning">
          ⚠️ High rain/storm chance. Consider indoor activities!
        </div>
      )}
    </div>
  );
}
