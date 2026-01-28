import React, { useState, useEffect } from 'react';

interface WeatherData {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number };
}

const Home = () => {
  const [city, setCity] = useState('Toronto'); // Default city
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data when the city changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) {
        setError('City is required');
        return;
      }

      try {
        const res = await fetch(`/api/weather?city=${city}`);

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Error fetching weather data');
          setWeather(null);
        } else {
          const data = await res.json();
          setWeather(data);
          setError(null);
        }
      } catch (error: any) {
        setError(error.message || 'Unexpected error');
        setWeather(null);
      }
    };

    fetchWeather();
  }, [city]); // Re-run the effect when the city changes

  return (
    <div className="weather-container">
      <h1 className="app-title">Weather App</h1>

      {/* Search bar */}
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />

      {error && <p className="error-message">{error}</p>}

      {weather ? (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
          <p className="weather-description">{weather.weather[0].description}</p>
          <p className="weather-temp">Temperature: {weather.main.temp}°C</p>
          <p className="weather-humidity">Humidity: {weather.main.humidity}%</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Home;
