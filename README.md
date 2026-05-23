
# Weather Travel Assistant

A full-stack weather application that  allows users to search for real-time weather by location, view a 5-day forecast, check current-location weather, save weather searches, manage saved records and export search history.

## Features

### Frontend
- Search weather by city/location
- View current weather conditions
- View 5-day forecast
- Select a forecast date and view detailed time-based forecast data
- Use browser geolocation to get current-location weather
- View weather icons and useful weather details
- Travel Readiness Score based on temperature, humidity, wind, and weather condition
- Google Maps location embed
- Responsive design for desktop, tablet, and mobile
- Error handling for invalid locations and failed requests

### Backend
- ASP.NET Core Web API
- RESTful API endpoints
- OpenWeather API integration
- MySQL database persistence
- Entity Framework Core ORM
- CRUD operations for saved weather searches
- CSV export for saved search history
- Swagger UI for API testing

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- Swagger / Swashbuckle

### External APIs
- OpenWeather API
- Google Maps Embed

## Project Structure

```txt
weather-travel-assistant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   └── WeatherTravelAssistant.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── Models/
│       ├── Services/
│       └── Program.cs
│
└── README.md
```

## Setup Instructions

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- .NET SDK
- MySQL
- OpenWeather API key

## Frontend Setup

```bash
cd frontend
npm install
```

Create a .env file inside the frontend folder:

```bash
VITE_BACKEND_URL=http://localhost:YOUR_BACKEND_PORT
```

Run the frontend:
```bash
npm run dev
```

The frontend will usually run at:
```bash
http://localhost:5173
```

## Backend Setup

```bash
cd backend/WeatherTravelAssistant.Api
dotnet restore
```

Create or update appsettings.Development.json with your database connection and OpenWeather API key:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=weather_travel_db;user=root;password=YOUR_PASSWORD;"
  },
  "OpenWeather": {
    "ApiKey": "YOUR_OPENWEATHER_API_KEY"
  }
}
```

Create the MySQL database:
```sql
CREATE DATABASE weather_travel_db;
```

Run migrations:
```bash
dotnet ef database update
```

Run the backend:
```bash
dotnet run
```

Swagger will be available at:
```bash
http://localhost:YOUR_BACKEND_PORT/swagger
```

## API Endpoints

### Weather
```bash
GET /api/Weather/current?location=Chicago
GET /api/Weather/forecast?location=Chicago
GET /api/Weather/current/coordinates?latitude=41.8781&longitude=-87.6298
GET /api/Weather/forecast/coordinates?latitude=41.8781&longitude=-87.6298
```

### Saved Weather Searches
```bash
GET    /api/WeatherSearches
GET    /api/WeatherSearches/{id}
POST   /api/WeatherSearches
PUT    /api/WeatherSearches/{id}
DELETE /api/WeatherSearches/{id}
```

### Export
```bash
GET /api/WeatherSearches/export/csv
```

## About PM Accelerator

This project includes an About page with information about Product Manager Accelerator and the creator of the project.

## Demo Video

Demo video link: Add your demo video link here

## Author

Created by Sindhoora Rajasekharuni