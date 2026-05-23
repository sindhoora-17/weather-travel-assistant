import {
  calculateTravelScore,
  getTravelRecommendation,
} from "../services/weatherService";
import type { WeatherData } from "../types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

function WeatherCard({ weather }: WeatherCardProps) {
  const travelScore = calculateTravelScore(
    weather.main.temp,
    weather.main.humidity,
    weather.wind.speed,
    weather.weather[0].description
  );

  return (
    <div className="weather-card">
      <h2>
        {weather.name}, {weather.sys.country}
      </h2>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        className="weather-icon"
      />

      <p className="temperature">{Math.round(weather.main.temp)}°C</p>
      <p className="condition">{weather.weather[0].description}</p>

      <div className="weather-details">
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind Speed: {weather.wind.speed} m/s</p>
      </div>

      <div className="travel-score-card">
        <h3>Travel Readiness Score: {travelScore}/100</h3>
        <p>{getTravelRecommendation(travelScore)}</p>
      </div>
    </div>
  );
}

export default WeatherCard;