const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getCurrentWeather(location: string) {
  const response = await fetch(
    `${BACKEND_URL}/api/Weather/current?location=${encodeURIComponent(location)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch weather. Please check the location.");
  }

  return response.json();
}

export async function getFiveDayForecast(location: string) {
  const response = await fetch(
    `${BACKEND_URL}/api/Weather/forecast?location=${encodeURIComponent(location)}`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch forecast. Please check the location.");
  }

  return response.json();
}

export async function getCurrentWeatherByCoords(
  latitude: number,
  longitude: number,
) {
  const response = await fetch(
    `${BACKEND_URL}/api/Weather/current/coordinates?latitude=${latitude}&longitude=${longitude}`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch weather for current location.");
  }

  return response.json();
}

export async function getFiveDayForecastByCoords(
  latitude: number,
  longitude: number,
) {
  const response = await fetch(
    `${BACKEND_URL}/api/Weather/forecast/coordinates?latitude=${latitude}&longitude=${longitude}`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch forecast for current location.");
  }

  return response.json();
}

export function calculateTravelScore(
  temp: number,
  humidity: number,
  windSpeed: number,
  condition: string,
) {
  let score = 100;

  if (temp < 5 || temp > 35) score -= 25;
  else if (temp < 12 || temp > 30) score -= 12;

  if (humidity > 80) score -= 10;
  if (windSpeed > 10) score -= 15;

  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("rain")) score -= 20;
  if (lowerCondition.includes("snow")) score -= 25;
  if (lowerCondition.includes("storm") || lowerCondition.includes("thunder")) {
    score -= 30;
  }

  return Math.max(score, 0);
}

export function getTravelRecommendation(score: number) {
  if (score >= 85) {
    return "Excellent weather for travel and outdoor plans.";
  }

  if (score >= 70) {
    return "Good travel conditions, but check minor weather changes.";
  }

  if (score >= 50) {
    return "Moderate conditions. Carry essentials and plan with caution.";
  }

  return "Poor travel conditions. Consider delaying outdoor plans.";
}

export async function saveWeatherSearch(searchData: {
  location: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  travelScore: number;
  notes: string;
}) {
  const response = await fetch(`${BACKEND_URL}/api/WeatherSearches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchData),
  });

  if (!response.ok) {
    throw new Error("Unable to save weather search.");
  }

  return response.json();
}

export async function getSavedWeatherSearches() {
  const response = await fetch(`${BACKEND_URL}/api/WeatherSearches`);

  if (!response.ok) {
    throw new Error("Unable to fetch saved weather searches.");
  }

  return response.json();
}

export async function deleteWeatherSearch(id: number) {
  const response = await fetch(`${BACKEND_URL}/api/WeatherSearches/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete weather search.");
  }
}

export function getCsvExportUrl() {
  return `${BACKEND_URL}/api/WeatherSearches/export/csv`;
}

export async function updateWeatherSearch(
  id: number,
  searchData: {
    id: number;
    location: string;
    country: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherCondition: string;
    travelScore: number;
    notes: string;
    searchedAt: string;
  },
) {
  const response = await fetch(`${BACKEND_URL}/api/WeatherSearches/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchData),
  });

  if (!response.ok) {
    throw new Error("Unable to update weather search.");
  }
}
