import React, { useState, useEffect } from 'react';
import './Weather.css';

const api = {
  key: "0217095cd5ee144ffef45b0c0d501ef3",
  base: "https://api.openweathermap.org/data/2.5/"
};

const Weather = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const getWeatherBackground = () => {
      if (!weather.weather) return 'default-bg'; // Return default if weather data is not available

      const weatherType = weather.weather[0].main.toLowerCase();
      switch (weatherType) {
        case 'clear':
          return 'clear-bg';
        case 'clouds':
          return 'cloudy-bg';
        case 'rain':
          return 'rainy-bg';
        case 'thunderstorm':
          return 'storm-bg';
        case 'snow':
          return 'snow-bg';
        default:
          return 'default-bg';
      }
    };

    document.body.className = getWeatherBackground(); // Update the body class

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.className = '';
    };
  }, [weather]);

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        })
        .catch(err => {
          console.error('Error fetching the weather data:', err);
        });
    }
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <div className="weather-app">
      <main>
        <div className='search-box'>
          <input
            type='text'
            className='search-bar'
            placeholder='Search...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={search}
          />
        </div>
        {weather.main && (
          <div className='location-box'>
            <div className='location'>
              {weather.name}, {weather.sys.country}
            </div>
            <div className='date'>
              {dateBuilder(new Date())}
            </div>
            <div className='weather-box'>
              <div className='temp'>
                {Math.round(weather.main.temp)}°C
              </div>
              <div className='weather'>
                {weather.weather[0].main}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Weather;
