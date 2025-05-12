import React from 'react';

const Weather = ({ weatherData }) => {
  if (!weatherData) return <div className="loading">Loading weather data...</div>;

  // Convert Celsius to Fahrenheit
  const celsiusTemp = Math.round(weatherData.main.temp);
  const fahrenheitTemp = Math.round((celsiusTemp * 9/5) + 32);
  
  const celsiusFeelsLike = Math.round(weatherData.main.feels_like);
  const fahrenheitFeelsLike = Math.round((celsiusFeelsLike * 9/5) + 32);

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
        <div className="weather-main">
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt={weatherData.weather[0].description} 
          />
          <div className="temperature">
            <h1>{celsiusTemp}°C / {fahrenheitTemp}°F</h1>
            <p>{weatherData.weather[0].description}</p>
          </div>
        </div>
      </div>
      <div className="weather-details">
        <div className="detail">
          <span>Feels Like</span>
          <span>{celsiusFeelsLike}°C / {fahrenheitFeelsLike}°F</span>
        </div>
        <div className="detail">
          <span>Humidity</span>
          <span>{weatherData.main.humidity}%</span>
        </div>
        <div className="detail">
          <span>Wind</span>
          <span>{weatherData.wind.speed} m/s</span>
        </div>
        <div className="detail">
          <span>Pressure</span>
          <span>{weatherData.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;