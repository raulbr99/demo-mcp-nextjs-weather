/**
 * Weather Service Module
 * Integrates with OpenWeatherMap API to fetch weather data
 */

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
  timestamp: string;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastData {
  location: string;
  country: string;
  forecast: ForecastDay[];
}

export interface ComparisonData {
  location1: WeatherData;
  location2: WeatherData;
  tempDifference: number;
  humidityDifference: number;
}

export interface HourlyWeather {
  time: string;
  hour: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number; // Probability of precipitation (0-100)
}

export interface HourlyForecastData {
  location: string;
  country: string;
  hourly: HourlyWeather[];
}

/**
 * Converts temperature between Celsius and Fahrenheit
 */
export function convertTemperature(temp: number, toUnit: 'celsius' | 'fahrenheit'): number {
  if (toUnit === 'fahrenheit') {
    return (temp * 9/5) + 32;
  }
  return temp;
}

/**
 * Fetches current weather data for a location
 */
export async function getCurrentWeather(
  location: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY is not configured in environment variables');
  }

  const unitParam = units === 'celsius' ? 'metric' : 'imperial';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=${unitParam}&appid=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 600 } // Cache for 10 minutes
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Location "${location}" not found. Please check the city name and try again.`);
    }
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    location: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    pressure: data.main.pressure,
    icon: data.weather[0].icon,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetches weather forecast for a location
 */
export async function getWeatherForecast(
  location: string,
  days: number = 5,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<ForecastData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY is not configured in environment variables');
  }

  const unitParam = units === 'celsius' ? 'metric' : 'imperial';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=${unitParam}&appid=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 1800 } // Cache for 30 minutes
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Location "${location}" not found. Please check the city name and try again.`);
    }
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Group forecasts by day and calculate daily averages
  const dailyForecasts = new Map<string, any[]>();
  
  data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyForecasts.has(date)) {
      dailyForecasts.set(date, []);
    }
    dailyForecasts.get(date)!.push(item);
  });

  const forecast: ForecastDay[] = Array.from(dailyForecasts.entries())
    .slice(0, days)
    .map(([date, items]) => {
      const temps = items.map(item => item.main.temp);
      const tempMin = Math.round(Math.min(...temps));
      const tempMax = Math.round(Math.max(...temps));
      
      // Get most common weather condition
      const midDayItem = items[Math.floor(items.length / 2)];
      
      return {
        date,
        tempMin,
        tempMax,
        description: midDayItem.weather[0].description,
        humidity: Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length),
        windSpeed: Math.round(items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length * 10) / 10,
        icon: midDayItem.weather[0].icon,
      };
    });

  return {
    location: data.city.name,
    country: data.city.country,
    forecast,
  };
}

/**
 * Compares weather between two locations
 */
export async function compareWeather(
  location1: string,
  location2: string,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<ComparisonData> {
  const [weather1, weather2] = await Promise.all([
    getCurrentWeather(location1, units),
    getCurrentWeather(location2, units),
  ]);

  return {
    location1: weather1,
    location2: weather2,
    tempDifference: Math.abs(weather1.temperature - weather2.temperature),
    humidityDifference: Math.abs(weather1.humidity - weather2.humidity),
  };
}

/**
 * Gets weather icon URL from OpenWeatherMap
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Fetches hourly weather forecast for a location (next 48 hours)
 */
export async function getHourlyForecast(
  location: string,
  hours: number = 24,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<HourlyForecastData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY is not configured in environment variables');
  }

  const unitParam = units === 'celsius' ? 'metric' : 'imperial';

  // First, get coordinates for the location
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error(`Geocoding API error: ${geoResponse.statusText}`);
  }

  const geoData = await geoResponse.json();

  if (!geoData || geoData.length === 0) {
    throw new Error(`Location "${location}" not found. Please check the city name and try again.`);
  }

  const { lat, lon, name, country } = geoData[0];

  // Now get hourly forecast using One Call API 3.0
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${unitParam}&exclude=minutely,daily,alerts&appid=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 1800 } // Cache for 30 minutes
  });

  if (!response.ok) {
    // If One Call 3.0 fails, fall back to forecast API
    const fallbackUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=${unitParam}&appid=${apiKey}`;
    const fallbackResponse = await fetch(fallbackUrl, {
      next: { revalidate: 1800 }
    });

    if (!fallbackResponse.ok) {
      throw new Error(`Weather API error: ${fallbackResponse.statusText}`);
    }

    const fallbackData = await fallbackResponse.json();

    // Process forecast API data (3-hour intervals)
    const hourly: HourlyWeather[] = fallbackData.list
      .slice(0, Math.min(hours / 3, 16)) // Limit to requested hours
      .map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          time: item.dt_txt,
          hour: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 10) / 10,
          pop: Math.round((item.pop || 0) * 100),
        };
      });

    return {
      location: fallbackData.city.name,
      country: fallbackData.city.country,
      hourly,
    };
  }

  const data = await response.json();

  // Process One Call API data (hourly)
  const hourly: HourlyWeather[] = data.hourly
    .slice(0, Math.min(hours, 48)) // Limit to requested hours (max 48)
    .map((item: any) => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toISOString(),
        hour: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: Math.round(item.temp),
        feelsLike: Math.round(item.feels_like),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.humidity,
        windSpeed: Math.round(item.wind_speed * 10) / 10,
        pop: Math.round((item.pop || 0) * 100),
      };
    });

  return {
    location: name,
    country: country,
    hourly,
  };
}

