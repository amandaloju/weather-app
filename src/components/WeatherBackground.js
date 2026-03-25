import React from 'react';

const WeatherBackground = ({ weatherId, isDay }) => {
  if (!weatherId) {
    return (
      <div className="wx-bg wx-default">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>
    );
  }

  // Thunder
  if (weatherId >= 200 && weatherId < 300) {
    return (
      <div className="wx-bg wx-thunder">
        <div className="cloud cloud-1 dark-cloud" />
        <div className="cloud cloud-2 dark-cloud" />
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="rain-drop" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${0.4 + Math.random() * 0.3}s`
          }} />
        ))}
        <div className="lightning" />
      </div>
    );
  }

  // Rain / Drizzle
  if (weatherId >= 300 && weatherId < 600) {
    return (
      <div className="wx-bg wx-rain">
        <div className="cloud cloud-1 dark-cloud" />
        <div className="cloud cloud-2 dark-cloud" />
        <div className="cloud cloud-3 dark-cloud" />
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="rain-drop" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${0.5 + Math.random() * 0.4}s`
          }} />
        ))}
      </div>
    );
  }

  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return (
      <div className="wx-bg wx-snow">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            fontSize: `${8 + Math.random() * 10}px`
          }}>❄</div>
        ))}
      </div>
    );
  }

  // Mist / Fog
  if (weatherId >= 700 && weatherId < 800) {
    return (
      <div className="wx-bg wx-mist">
        <div className="mist-layer mist-1" />
        <div className="mist-layer mist-2" />
        <div className="mist-layer mist-3" />
      </div>
    );
  }

  // Clear
  if (weatherId === 800) {
    return isDay ? (
      <div className="wx-bg wx-clear-day">
        <div className="sun">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>
    ) : (
      <div className="wx-bg wx-clear-night">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`
          }} />
        ))}
        <div className="moon" />
      </div>
    );
  }

  // Cloudy
  return isDay ? (
    <div className="wx-bg wx-cloudy-day">
      <div className="sun sun-behind" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
    </div>
  ) : (
    <div className="wx-bg wx-cloudy-night">
      <div className="moon" />
      <div className="cloud cloud-1" style={{ opacity: 0.6 }} />
      <div className="cloud cloud-2" style={{ opacity: 0.5 }} />
    </div>
  );
};

export default WeatherBackground;
