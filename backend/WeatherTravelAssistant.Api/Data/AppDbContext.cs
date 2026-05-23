using Microsoft.EntityFrameworkCore;
using WeatherTravelAssistant.Api.Models;

namespace WeatherTravelAssistant.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<WeatherSearch> WeatherSearches => Set<WeatherSearch>();
}