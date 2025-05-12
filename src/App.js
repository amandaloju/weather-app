import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Weather from './components/Weather';
import SearchBar from './components/SearchBar';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // You'll need to sign up for a free API key at OpenWeatherMap
  // https://openweathermap.org/api
  const API_KEY = '660bf408b3c65e20c929bd495fc558c9'; // Replace with your actual API key
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric' // Use 'imperial' for Fahrenheit
        }
      });
      
      setWeatherData(response.data);
      setLoading(false);
    } catch (err) {
      setError('City not found. Please try again.');
      setLoading(false);
      console.error('Error fetching weather data:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="app-title">Weather App</h1>
        <SearchBar onSearch={fetchWeather} />
        
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && weatherData && <Weather weatherData={weatherData} />}
        
        {!weatherData && !loading && !error && (
          <div className="welcome-message">
            <h2>Welcome to the Weather App</h2>
            <p>Enter a city name to get the current weather</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;