import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Weather from './components/Weather';
import SearchBar from './components/SearchBar';
import CityComparison from './components/CityComparison';
import WeatherBackground from './components/WeatherBackground';

const API_KEY = '660bf408b3c65e20c929bd495fc558c9';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const AQI_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
const UV_URL = 'https://api.openweathermap.org/data/2.5/uvi';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [uvData, setUvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'metric');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history') || '[]'));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => { localStorage.setItem('unit', unit); }, [unit]);
  useEffect(() => { localStorage.setItem('history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

  // Auto geolocation on load only
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lon: longitude });
        await fetchWeatherByCoords(latitude, longitude, unit);
      });
    }
  }, []);

  // Re-fetch when unit changes
  useEffect(() => {
    if (currentCity) fetchWeather(currentCity, unit);
    else if (currentCoords) fetchWeatherByCoords(currentCoords.lat, currentCoords.lon, unit);
  }, [unit]);

  const fetchWeatherByCoords = async (lat, lon, currentUnit = unit) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes, aqiRes, uvRes] = await Promise.all([
        axios.get(API_URL, { params: { lat, lon, appid: API_KEY, units: currentUnit } }),
        axios.get(FORECAST_URL, { params: { lat, lon, appid: API_KEY, units: currentUnit } }),
        axios.get(AQI_URL, { params: { lat, lon, appid: API_KEY } }),
        axios.get(UV_URL, { params: { lat, lon, appid: API_KEY } }),
      ]);
      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      setAqiData(aqiRes.data);
      setUvData(uvRes.data);
    } catch (err) {
      setError('Could not fetch weather. Please try again.');
    }
    setLoading(false);
  };

  const fetchWeather = async (city, currentUnit = unit) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(API_URL, { params: { q: city, appid: API_KEY, units: currentUnit } }),
        axios.get(FORECAST_URL, { params: { q: city, appid: API_KEY, units: currentUnit } }),
      ]);
      const { lat, lon } = weatherRes.data.coord;
      const [aqiRes, uvRes] = await Promise.all([
        axios.get(AQI_URL, { params: { lat, lon, appid: API_KEY } }),
        axios.get(UV_URL, { params: { lat, lon, appid: API_KEY } }),
      ]);
      setWeatherData(weatherRes.data);
      setForecastData(forecastRes.data);
      setAqiData(aqiRes.data);
      setUvData(uvRes.data);
      setCurrentCity(city);
      setCurrentCoords(null);
      setHistory(prev => [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5));
    } catch (err) {
      setError('City not found. Please try again.');
    }
    setLoading(false);
  };

  const toggleFavorite = (city) => {
    setFavorites(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const isFavorite = weatherData && favorites.includes(weatherData.name);

  const weatherId = weatherData?.weather?.[0]?.id;
  const isDay = weatherData?.weather?.[0]?.icon?.endsWith('d') ?? true;

  const getBgClass = (id, day) => {
    if (!id) return '';
    if (id >= 200 && id < 300) return 'bg-thunder';
    if (id >= 300 && id < 600) return 'bg-rain';
    if (id >= 600 && id < 700) return 'bg-snow';
    if (id >= 700 && id < 800) return 'bg-mist';
    if (id === 800) return day ? 'bg-clear-day' : 'bg-clear-night';
    return day ? 'bg-cloudy-day' : 'bg-cloudy-night';
  };

  const bgClass = getBgClass(weatherId, isDay);

  return (
    <div className="App">
      <WeatherBackground weatherId={weatherId} isDay={isDay} />
      <div className={`container ${bgClass}`}>
        <div className="title-row">
          <h1 className="app-title">Weather</h1>
        </div>

        <SearchBar onSearch={fetchWeather} />

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="chip-row">
            <span className="chip-label">⭐ Favorites:</span>
            {favorites.map(city => (
              <button key={city} className="chip" onClick={() => fetchWeather(city)}>{city}</button>
            ))}
          </div>
        )}

        {/* Recent History */}
        {history.length > 0 && (
          <div className="chip-row">
            <span className="chip-label">🕐 Recent:</span>
            {history.map(city => (
              <button key={city} className="chip" onClick={() => fetchWeather(city)}>{city}</button>
            ))}
          </div>
        )}

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && weatherData && (
          <>
            <div className="action-row">
              <button className="unit-toggle" onClick={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')}>
                {unit === 'metric' ? '°C → °F' : '°F → °C'}
              </button>
              <button className="fav-btn" onClick={() => toggleFavorite(weatherData.name)}>
                {isFavorite ? '★ Unfavorite' : '☆ Favorite'}
              </button>
              <button className="compare-btn" onClick={() => setCompareMode(!compareMode)}>
                {compareMode ? '✕ Close Compare' : '⇄ Compare Cities'}
              </button>
            </div>
            <Weather weatherData={weatherData} forecastData={forecastData} aqiData={aqiData} uvData={uvData} unit={unit} />
          </>
        )}

        {compareMode && (
          <CityComparison unit={unit} apiKey={API_KEY} />
        )}


      </div>
    </div>
  );
}

export default App;
