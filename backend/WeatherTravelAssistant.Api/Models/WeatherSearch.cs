namespace WeatherTravelAssistant.Api.Models;

public class WeatherSearch
{
    public int Id { get; set; }

    public string Location { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public double Temperature { get; set; }

    public int Humidity { get; set; }

    public double WindSpeed { get; set; }

    public string WeatherCondition { get; set; } = string.Empty;

    public int TravelScore { get; set; }

    public string Notes { get; set; } = string.Empty;

    public DateTime SearchedAt { get; set; } = DateTime.UtcNow;
}