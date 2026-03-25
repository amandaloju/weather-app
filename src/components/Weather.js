import React, { useState } from 'react';

const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_COLORS = ['', '#00e400', '#92d050', '#ffff00', '#ff7e00', '#ff0000'];

const getWeatherBg = (id, isDay) => {
  if (id >= 200 && id < 300) return 'bg-thunder';
  if (id >= 300 && id < 600) return 'bg-rain';
  if (id >= 600 && id < 700) return 'bg-snow';
  if (id >= 700 && id < 800) return 'bg-mist';
  if (id === 800) return isDay ? 'bg-clear-day' : 'bg-clear-night';
  return isDay ? 'bg-cloudy-day' : 'bg-cloudy-night';
};

const formatTime = (unix) =>
  new Date(unix * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const Weather = ({ weatherData, forecastData, aqiData, uvData, unit }) => {
  const [activeTab, setActiveTab] = useState('daily');

  if (!weatherData) return null;

  const isDay = weatherData.weather[0].icon.endsWith('d');
  const bgClass = getWeatherBg(weatherData.weather[0].id, isDay);
  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const unitLabel = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  // Group forecast by day
  const dailyMap = {};
  if (forecastData) {
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!dailyMap[date]) dailyMap[date] = [];
      dailyMap[date].push(item);
    });
  }
  const dailyDays = Object.entries(dailyMap).slice(0, 5);
  const hourlyList = forecastData ? forecastData.list.slice(0, 8) : [];

  const aqi = aqiData?.list?.[0]?.main?.aqi;
  const uv = uvData?.value;

  return (
    <div className={`weather-card ${bgClass}`}>
      <div className="weather-header">
        <h2>{weatherData.name}, {weatherData.sys.country}</h2>
        <div className="weather-main">
          <div className="temperature">
            <h1>{temp}{unitLabel}</h1>
            <p>{weatherData.weather[0].description}</p>
            <p className="temp-range">H: {Math.round(weatherData.main.temp_max)}{unitLabel} · L: {Math.round(weatherData.main.temp_min)}{unitLabel}</p>
          </div>
        </div>
        <div className="sun-row">
          <span>🌅 {formatTime(weatherData.sys.sunrise)}</span>
          <span>🌇 {formatTime(weatherData.sys.sunset)}</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail"><span>Feels Like</span><span>{feelsLike}{unitLabel}</span></div>
        <div className="detail"><span>Humidity</span><span>{weatherData.main.humidity}%</span></div>
        <div className="detail"><span>Wind</span><span>{weatherData.wind.speed} {windUnit}</span></div>
        <div className="detail"><span>Pressure</span><span>{weatherData.main.pressure} hPa</span></div>
        <div className="detail"><span>Visibility</span><span>{((weatherData.visibility || 0) / 1000).toFixed(1)} km</span></div>
        <div className="detail"><span>Cloud Cover</span><span>{weatherData.clouds.all}%</span></div>
        {uv !== undefined && (
          <div className="detail"><span>UV Index</span><span>{uv}</span></div>
        )}
        {aqi && (
          <div className="detail">
            <span>Air Quality</span>
            <span style={{ color: AQI_COLORS[aqi], fontWeight: 'bold' }}>{AQI_LABELS[aqi]}</span>
          </div>
        )}
      </div>

      {forecastData && (
        <div className="forecast-section">
          <div className="forecast-tabs">
            <button className={activeTab === 'daily' ? 'active' : ''} onClick={() => setActiveTab('daily')}>5-Day</button>
            <button className={activeTab === 'hourly' ? 'active' : ''} onClick={() => setActiveTab('hourly')}>Hourly</button>
          </div>

          {activeTab === 'daily' && (
            <div className="forecast-list">
              {dailyDays.map(([date, items]) => {
                const min = Math.round(Math.min(...items.map(i => i.main.temp_min)));
                const max = Math.round(Math.max(...items.map(i => i.main.temp_max)));
                const mid = items[Math.floor(items.length / 2)];
                const pop = Math.round((mid.pop || 0) * 100);
                return (
                  <div className="forecast-item" key={date}>
                    <span className="forecast-date">{date}</span>
                    <img src={`https://openweathermap.org/img/wn/${mid.weather[0].icon}.png`} alt={mid.weather[0].description} />
                    {pop > 0 && <span className="precip">💧{pop}%</span>}
                    <span className="forecast-temp">{max}° / {min}{unitLabel}</span>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'hourly' && (
            <div className="forecast-list hourly">
              {hourlyList.map(item => {
                const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const pop = Math.round((item.pop || 0) * 100);
                return (
                  <div className="forecast-item" key={item.dt}>
                    <span className="forecast-date">{time}</span>
                    <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
                    {pop > 0 && <span className="precip">💧{pop}%</span>}
                    <span className="forecast-temp">{Math.round(item.main.temp)}{unitLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
