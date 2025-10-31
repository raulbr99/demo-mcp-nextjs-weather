/**
 * Shared TypeScript types for weather data across the application
 */

export type TemperatureUnit = "celsius" | "fahrenheit";

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

export interface WeatherWidgetData {
  type: "current_weather" | "forecast" | "comparison" | "error";
  units?: TemperatureUnit;
  location?: string;
  country?: string;
  temperature?: number;
  feelsLike?: number;
  description?: string;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  icon?: string;
  forecast?: ForecastDay[];
  location1?: WeatherData;
  location2?: WeatherData;
  tempDifference?: number;
  humidityDifference?: number;
  error?: string;
}

export interface WeatherToolInput {
  location: string;
  units?: TemperatureUnit;
}

export interface ForecastToolInput extends WeatherToolInput {
  days?: number;
}

export interface ComparisonToolInput {
  location1: string;
  location2: string;
  units?: TemperatureUnit;
}

