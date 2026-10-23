import { useEffect, useRef, useState } from "react";
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
  const [saveWarning, setSaveWarning] = useState("");
  const currentRequest = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  useEffect(() => () => { currentRequest.current++; controllerRef.current?.abort(); }, []);
  const startRequest = () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const id = ++currentRequest.current;
    setLoading(true); setError(""); setSaveWarning("");
    setWeather(null); setForecast(null);
    return { id, controller };
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = location.trim();
    if (!query) { setError("Please enter a city, zip code, or location."); return; }
    const { id, controller } = startRequest();
    try {
      const [data, forecastData] = await Promise.all([
        getCurrentWeather(query, controller.signal),
        getFiveDayForecast(query, controller.signal),
      ]);
      if (id !== currentRequest.current) return;
      setWeather(data); setForecast(forecastData);
      setLoading(false); // Display the result without waiting for history persistence.
      try {
        await saveWeatherSearch({
          location: data.name, country: data.sys.country,
          temperature: data.main.temp, humidity: data.main.humidity,
          windSpeed: data.wind.speed, weatherCondition: data.weather[0].description,
          travelScore: calculateTravelScore(data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].description),
          notes: "Saved from weather search",
        });
      } catch {
        if (id === currentRequest.current) setSaveWarning("Weather loaded, but history could not be saved.");
      }
    } catch {
      if (id === currentRequest.current && !controller.signal.aborted) setError("Could not load weather for that location.");
    } finally {
      if (id === currentRequest.current) setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation is not supported by your browser."); return; }
    controllerRef.current?.abort();
    const locationId = ++currentRequest.current;
    setLoading(true); setError(""); setSaveWarning("");
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      if (locationId !== currentRequest.current) return;
      const { id, controller } = startRequest();
      try {
        const [data, forecastData] = await Promise.all([
          getCurrentWeatherByCoords(coords.latitude, coords.longitude, controller.signal),
          getFiveDayForecastByCoords(coords.latitude, coords.longitude, controller.signal),
        ]);
        if (id !== currentRequest.current) return;
        setWeather(data); setForecast(forecastData);
      } catch {
        if (id === currentRequest.current && !controller.signal.aborted) setError("Could not fetch weather for your current location.");
      } finally {
        if (id === currentRequest.current) setLoading(false);
      }
    }, () => {
      if (locationId !== currentRequest.current) return;
      setError("Location permission was denied or unavailable."); setLoading(false);
    }, { timeout: 10000 });
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

        {error && <p className="error-message" role="alert">{error}</p>}
        {saveWarning && <p className="info-message" role="status">{saveWarning}</p>}

        {weather && <WeatherCard weather={weather} />}
        {weather && (
          <LocationMap location={weather.name} country={weather.sys.country} />
        )}

        {forecast && <ForecastList key={forecast.city.name + forecast.city.country} forecast={forecast} />}
      </div>
    </section>
  );
}

export default HomePage;