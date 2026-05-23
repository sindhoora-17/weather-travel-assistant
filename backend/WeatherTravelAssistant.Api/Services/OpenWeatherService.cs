using System.Text.Json;

namespace WeatherTravelAssistant.Api.Services;

public class OpenWeatherService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public OpenWeatherService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<JsonElement> GetCurrentWeatherAsync(string location)
    {
        var apiKey = _configuration["OpenWeather:ApiKey"];

        var url =
            $"https://api.openweathermap.org/data/2.5/weather?q={Uri.EscapeDataString(location)}&appid={apiKey}&units=metric";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Unable to fetch current weather.");
        }

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }

    public async Task<JsonElement> GetForecastAsync(string location)
    {
        var apiKey = _configuration["OpenWeather:ApiKey"];

        var url =
            $"https://api.openweathermap.org/data/2.5/forecast?q={Uri.EscapeDataString(location)}&appid={apiKey}&units=metric";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Unable to fetch forecast.");
        }

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }

    public async Task<JsonElement> GetCurrentWeatherByCoordsAsync(double latitude, double longitude)
    {
        var apiKey = _configuration["OpenWeather:ApiKey"];

        var url =
            $"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={apiKey}&units=metric";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Unable to fetch current weather by coordinates.");
        }

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }

    public async Task<JsonElement> GetForecastByCoordsAsync(double latitude, double longitude)
    {
        var apiKey = _configuration["OpenWeather:ApiKey"];

        var url =
            $"https://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&appid={apiKey}&units=metric";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Unable to fetch forecast by coordinates.");
        }

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(json);
    }
}