using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;
using WeatherTravelAssistant.Api.Data;
using WeatherTravelAssistant.Api.Models;

namespace WeatherTravelAssistant.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherSearchesController : ControllerBase
{
    private readonly AppDbContext _context;

    public WeatherSearchesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<WeatherSearch>>> GetAllSearches()
    {
        return await _context.WeatherSearches
            .OrderByDescending(search => search.SearchedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WeatherSearch>> GetSearchById(int id)
    {
        var search = await _context.WeatherSearches.FindAsync(id);

        if (search == null)
        {
            return NotFound();
        }

        return search;
    }

    [HttpPost]
    public async Task<ActionResult<WeatherSearch>> CreateSearch(WeatherSearch weatherSearch)
    {
        if (string.IsNullOrWhiteSpace(weatherSearch.Location))
        {
            return BadRequest("Location is required.");
        }

        weatherSearch.SearchedAt = DateTime.UtcNow;

        _context.WeatherSearches.Add(weatherSearch);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSearchById), new { id = weatherSearch.Id }, weatherSearch);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSearch(int id, WeatherSearch updatedSearch)
    {
        var existingSearch = await _context.WeatherSearches.FindAsync(id);

        if (existingSearch == null)
        {
            return NotFound();
        }

        existingSearch.Location = updatedSearch.Location;
        existingSearch.Country = updatedSearch.Country;
        existingSearch.Temperature = updatedSearch.Temperature;
        existingSearch.Humidity = updatedSearch.Humidity;
        existingSearch.WindSpeed = updatedSearch.WindSpeed;
        existingSearch.WeatherCondition = updatedSearch.WeatherCondition;
        existingSearch.TravelScore = updatedSearch.TravelScore;
        existingSearch.Notes = updatedSearch.Notes;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSearch(int id)
    {
        var search = await _context.WeatherSearches.FindAsync(id);

        if (search == null)
        {
            return NotFound();
        }

        _context.WeatherSearches.Remove(search);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportSearchesAsCsv()
    {
        var searches = await _context.WeatherSearches
            .OrderByDescending(search => search.SearchedAt)
            .ToListAsync();

        static string CsvField(object? value)
        {
            var text = Convert.ToString(value, CultureInfo.InvariantCulture) ?? "";
            // Quote fields with separators, line breaks or quotes; escape embedded quotes.
            return text.IndexOfAny(new[] { ',', '"', '\r', '\n' }) >= 0
                ? "\"" + text.Replace("\"", "\"\"") + "\""
                : text;
        }

        var csv = new StringBuilder("Id,Location,Country,Temperature,Humidity,WindSpeed,WeatherCondition,TravelScore,Notes,SearchedAt\r\n");
        foreach (var search in searches)
        {
            var fields = new object?[] {
                search.Id, search.Location, search.Country, search.Temperature,
                search.Humidity, search.WindSpeed, search.WeatherCondition,
                search.TravelScore, search.Notes, search.SearchedAt.ToString("O")
            };
            csv.AppendLine(string.Join(",", fields.Select(CsvField)));
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());

        return File(bytes, "text/csv", "weather-searches.csv");
    }
}