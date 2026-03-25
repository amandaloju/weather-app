import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const CityComparison = ({ darkMode, unit, apiKey }) => {
  const [cities, setCities] = useState(['', '']);
  const [results, setResults] = useState([null, null]);
  const [errors, setErrors] = useState(['', '']);

  const fetchCity = async (index) => {
    const city = cities[index].trim();
    if (!city) return;
    try {
      const res = await axios.get(API_URL, { params: { q: city, appid: apiKey, units: unit } });
      setResults(prev => { const r = [...prev]; r[index] = res.data; return r; });
      setErrors(prev => { const e = [...prev]; e[index] = ''; return e; });
    } catch {
      setErrors(prev => { const e = [...prev]; e[index] = 'City not found'; return e; });
      setResults(prev => { const r = [...prev]; r[index] = null; return r; });
    }
  };

  const unitLabel = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="compare-container">
      <h3 className="compare-title">⇄ Compare Cities</h3>
      <div className="compare-grid">
        {[0, 1].map(i => (
          <div key={i} className="compare-col">
            <div className="compare-search">
              <input
                className="search-input"
                placeholder={`City ${i + 1}`}
                value={cities[i]}
                onChange={e => setCities(prev => { const c = [...prev]; c[i] = e.target.value; return c; })}
                onKeyDown={e => e.key === 'Enter' && fetchCity(i)}
              />
              <button className="search-button" onClick={() => fetchCity(i)}>Go</button>
            </div>
            {errors[i] && <p className="error" style={{ padding: '8px' }}>{errors[i]}</p>}
            {results[i] && (
              <div className="compare-card">
                <h4>{results[i].name}, {results[i].sys.country}</h4>
                <img
                  src={`https://openweathermap.org/img/wn/${results[i].weather[0].icon}@2x.png`}
                  alt={results[i].weather[0].description}
                />
                <p className="compare-temp">{Math.round(results[i].main.temp)}{unitLabel}</p>
                <p>{results[i].weather[0].description}</p>
                <div className="compare-details">
                  <span>💧 {results[i].main.humidity}%</span>
                  <span>💨 {results[i].wind.speed} {windUnit}</span>
                  <span>🌡 Feels {Math.round(results[i].main.feels_like)}{unitLabel}</span>
                  <span>☁️ {results[i].clouds.all}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityComparison;
