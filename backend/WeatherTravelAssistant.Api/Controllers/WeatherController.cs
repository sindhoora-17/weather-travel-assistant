using Microsoft.AspNetCore.Mvc;
using WeatherTravelAssistant.Api.Services;

namespace WeatherTravelAssistant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly OpenWeatherService _openWeatherService;

    public WeatherController(OpenWeatherService openWeatherService)
    {
        _openWeatherService = openWeatherService;
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrentWeather([FromQuery] string location)
    {
        if (string.IsNullOrWhiteSpace(location))
        {
            return BadRequest("Location is required.");
        }

        try
        {
            var weather = await _openWeatherService.GetCurrentWeatherAsync(location);
            return Ok(weather);
        }
        catch
        {
            return NotFound("Could not fetch weather for this location.");
        }
    }

    [HttpGet("forecast")]
    public async Task<IActionResult> GetForecast([FromQuery] string location)
    {
        if (string.IsNullOrWhiteSpace(location))
        {
            return BadRequest("Location is required.");
        }

        try
        {
            var forecast = await _openWeatherService.GetForecastAsync(location);
            return Ok(forecast);
        }
        catch
        {
            return NotFound("Could not fetch forecast for this location.");
        }
    }

    [HttpGet("current/coordinates")]
    public async Task<IActionResult> GetCurrentWeatherByCoords(
    [FromQuery] double latitude,
    [FromQuery] double longitude)
    {
        try
        {
            var weather = await _openWeatherService.GetCurrentWeatherByCoordsAsync(latitude, longitude);
            return Ok(weather);
        }
        catch
        {
            return NotFound("Could not fetch weather for these coordinates.");
        }
    }

    [HttpGet("forecast/coordinates")]
    public async Task<IActionResult> GetForecastByCoords(
    [FromQuery] double latitude,
    [FromQuery] double longitude)
    {
        try
        {
            var forecast = await _openWeatherService.GetForecastByCoordsAsync(latitude, longitude);
            return Ok(forecast);
        }
        catch
        {
            return NotFound("Could not fetch forecast for these coordinates.");
        }
    }
}