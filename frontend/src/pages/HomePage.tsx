import { useState } from "react";
import {
  getCurrentWeather,
  getFiveDayForecast,
  getCurrentWeatherByCoords,
  getFiveDayForecastByCoords,
  calculateTravelScore,
  saveWeatherSearch,
} from "../services/weatherService";
import type { WeatherData, ForecastData } from "../types/weather";
import LocationMap from "../components/LocationMap";
import WeatherCard from "../components/WeatherCard";
import ForecastList from "../components/ForecastList";

function HomePage() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!location.trim()) {
      setError("Please enter a city, zip code, or location.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);
      setForecast(null);

      const data = await getCurrentWeather(location);
      setWeather(data);

      const score = calculateTravelScore(
        data.main.temp,
        data.main.humidity,
        data.wind.speed,
        data.weather[0].description
      );

      await saveWeatherSearch({
        location: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherCondition: data.weather[0].description,
        travelScore: score,
        notes: "Saved from weather search",
      });

      const forecastData = await getFiveDayForecast(location);
      setForecast(forecastData);
    } catch {
      setError("Could not find weather for that location.");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
          setWeather(weatherData);

          const forecastData = await getFiveDayForecastByCoords(latitude, longitude);
          setForecast(forecastData);
        } catch {
          setError("Could not fetch weather for your current location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission was denied.");
        setLoading(false);
      }
    );
  };

  return (
    <section className="home-page">
      <div className="hero-card">
        <h1>Weather Travel Assistant</h1>
        <p>
          Search any city, zip code, or location to view current weather,
          forecast details, and travel recommendations.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city, zip code, or coordinates"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <button type="submit">Search Weather</button>
        </form>

        <button
          className="secondary-button"
          type="button"
          onClick={handleCurrentLocation}
        >
          Use My Current Location
        </button>

        {loading && <p className="info-message">Loading weather...</p>}

        {error && <p className="error-message">{error}</p>}

        {weather && <WeatherCard weather={weather} />}
        {weather && (
          <LocationMap location={weather.name} country={weather.sys.country} />
        )}

        {forecast && <ForecastList forecast={forecast} />}
      </div>
    </section>
  );
}

export default HomePage;