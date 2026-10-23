using Microsoft.EntityFrameworkCore;
using WeatherTravelAssistant.Api.Data;
using WeatherTravelAssistant.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Railway assigns the port at runtime. Bind to all interfaces rather than localhost.
builder.WebHost.UseUrls("http://0.0.0.0:" + (Environment.GetEnvironmentVariable("PORT") ?? "8080"));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var sharedHistoryEnabled = builder.Configuration.GetValue<bool>("EnableSharedHistory");
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    // Railway service reference variables; never expose these to the Vite app.
    var host = Environment.GetEnvironmentVariable("MYSQLHOST");
    var database = Environment.GetEnvironmentVariable("MYSQLDATABASE");
    var user = Environment.GetEnvironmentVariable("MYSQLUSER");
    var password = Environment.GetEnvironmentVariable("MYSQLPASSWORD");
    var port = Environment.GetEnvironmentVariable("MYSQLPORT") ?? "3306";
    if (!string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(database)
        && !string.IsNullOrEmpty(user) && password != null)
        connectionString = $"Server={host};Port={port};Database={database};User={user};Password={password};";
}
if (sharedHistoryEnabled && string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("History is enabled but the MySQL connection is missing.");

if (!string.IsNullOrWhiteSpace(connectionString))
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var allowedOrigins = new List<string> { "http://localhost:5173", "http://127.0.0.1:5173" };
var productionOrigin = builder.Configuration["FrontendOrigin"]?.TrimEnd('/');
if (!string.IsNullOrWhiteSpace(productionOrigin) && Uri.TryCreate(productionOrigin, UriKind.Absolute, out var parsed)
    && parsed.Scheme == Uri.UriSchemeHttps)
    allowedOrigins.Add(parsed.GetLeftPart(UriPartial.Authority));
builder.Services.AddCors(options => options.AddPolicy("AllowFrontend", policy =>
    policy.WithOrigins(allowedOrigins.ToArray()).AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddHttpClient<OpenWeatherService>();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend");
// Public demo doesn't have accounts: disable shared history by default to avoid exposing visitor searches.
// History is available locally or for private testing by explicitly setting EnableSharedHistory=true.
app.Use(async (context, next) =>
{
    if (!sharedHistoryEnabled && context.Request.Path.StartsWithSegments("/api/WeatherSearches"))
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        await context.Response.WriteAsJsonAsync(new { error = "Shared history disabled on public demo." });
        return;
    }
    await next();
});
app.UseAuthorization();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();
app.Run();
