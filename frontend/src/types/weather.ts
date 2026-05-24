export interface WeatherData {
  name: string;

  sys: {
    country: string;
  };

  main: {
    temp: number;
    humidity: number;
  };

  weather: {
    description: string;
    icon: string;
  }[];

  wind: {
    speed: number;
  };
}

export interface ForecastItem {
  dt_txt: string;

  main: {
    temp: number;
    humidity: number;
  };

  weather: {
    description: string;
    icon: string;
  }[];

  wind: {
    speed: number;
  };
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

export interface SavedWeatherSearch {
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
}
