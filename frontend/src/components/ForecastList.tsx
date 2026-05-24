import { useState } from "react";
import type { ForecastData } from "../types/weather";

interface ForecastListProps {
    forecast: ForecastData;
}

function ForecastList({ forecast }: ForecastListProps) {
    const forecastDates = Array.from(
        new Set(forecast.list.map((item) => item.dt_txt.split(" ")[0]))
    );

    const [selectedDate, setSelectedDate] = useState(forecastDates[0]);

    const selectedDateItems = forecast.list.filter((item) =>
        item.dt_txt.startsWith(selectedDate)
    );

    return (
        <div className="forecast-section">
            <h2>
                5-Day Forecast for {forecast.city.name}, {forecast.city.country}
            </h2>

            <div className="date-selector">
                <label htmlFor="forecast-date">View forecast for a specific date:</label>

                <select
                    id="forecast-date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                >
                    {forecastDates.map((date) => (
                        <option key={date} value={date}>
                            {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                        </option>
                    ))}
                </select>
            </div>

            <div className="selected-day-section">
                <h3>
                    Detailed Forecast for{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}
                </h3>

                <div className="hourly-grid">
                    {selectedDateItems.map((item) => (
                        <div className="hourly-card" key={item.dt_txt}>
                            <h4>
                                {new Date(item.dt_txt).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </h4>

                            <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                                className="forecast-icon"
                            />

                            <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
                            <p className="condition">{item.weather[0].description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <h3 className="summary-heading">5-Day Summary</h3>

            <div className="forecast-grid">
                {forecast.list
                    .filter((item) => item.dt_txt.includes("12:00:00"))
                    .map((item) => (
                        <div className="forecast-card" key={item.dt_txt}>
                            <h3>
                                {new Date(item.dt_txt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </h3>

                            <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                alt={item.weather[0].description}
                                className="forecast-icon"
                            />

                            <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
                            <p className="condition">{item.weather[0].description}</p>
                            <p>Humidity: {item.main.humidity}%</p>
                            <p>Wind: {item.wind.speed} m/s</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default ForecastList;