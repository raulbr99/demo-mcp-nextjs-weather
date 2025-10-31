"use client";

import { getWeatherIconUrl } from "@/lib/weather-service";

export interface WeatherDisplayProps {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
  units?: "celsius" | "fahrenheit";
}

export function WeatherDisplay({
  location,
  country,
  temperature,
  feelsLike,
  description,
  humidity,
  windSpeed,
  pressure,
  icon,
  units = "celsius",
}: WeatherDisplayProps) {
  const unitSymbol = units === "celsius" ? "°C" : "°F";
  const windUnit = units === "celsius" ? "m/s" : "mph";

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-slate-700">
      {/* Location Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {location}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{country}</p>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={getWeatherIconUrl(icon)}
            alt={description}
            className="w-24 h-24"
          />
          <div>
            <div className="text-5xl font-bold text-slate-900 dark:text-white">
              {temperature}{unitSymbol}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Feels like {feelsLike}{unitSymbol}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Description */}
      <div className="mb-4">
        <p className="text-lg capitalize text-slate-700 dark:text-slate-300">
          {description}
        </p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 dark:border-slate-600">
        <div className="text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            Humidity
          </div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            {humidity}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            Wind
          </div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            {windSpeed} {windUnit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            Pressure
          </div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            {pressure} hPa
          </div>
        </div>
      </div>
    </div>
  );
}

