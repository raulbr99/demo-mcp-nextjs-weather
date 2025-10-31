"use client";

import { getWeatherIconUrl } from "@/lib/weather-service";

interface HourlyWeatherProps {
  location: string;
  country: string;
  hourly: Array<{
    hour: string;
    temperature: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pop: number;
  }>;
  units?: "celsius" | "fahrenheit";
}

export function HourlyForecast({
  location,
  country,
  hourly,
  units = "celsius",
}: HourlyWeatherProps) {
  const unitSymbol = units === "celsius" ? "°C" : "°F";
  const speedUnit = units === "celsius" ? "m/s" : "mph";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {location}, {country}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Hourly Forecast - Next {hourly.length} hours
        </p>
      </div>

      {/* Scrollable hourly cards */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max px-2">
          {hourly.map((hour, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-700 p-4"
            >
              {/* Time */}
              <p className="text-center text-sm font-semibold text-slate-900 dark:text-white mb-3">
                {hour.hour}
              </p>

              {/* Weather icon */}
              <div className="flex justify-center mb-3">
                <img
                  src={getWeatherIconUrl(hour.icon)}
                  alt={hour.description}
                  className="w-12 h-12"
                  title={hour.description}
                />
              </div>

              {/* Temperature */}
              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {hour.temperature}{unitSymbol}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Feels {hour.feelsLike}{unitSymbol}
                </p>
              </div>

              {/* Precipitation */}
              {hour.pop > 0 && (
                <div className="flex items-center justify-center gap-1 mb-2">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78-.03 1.632.548 2.158A3.989 3.989 0 007.5 16a3.989 3.989 0 002.77-1.016c.578-.526.798-1.378.548-2.158L10 10.274v-1.97l-2.5 1-.5 1.97z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium text-blue-500">
                    {hour.pop}%
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">💧</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {hour.humidity}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">💨</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {hour.windSpeed} {speedUnit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 px-4">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78-.03 1.632.548 2.158A3.989 3.989 0 007.5 16a3.989 3.989 0 002.77-1.016c.578-.526.798-1.378.548-2.158L10 10.274v-1.97l-2.5 1-.5 1.97z" clipRule="evenodd" />
          </svg>
          <span>Precipitation chance</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💧</span>
          <span>Humidity</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💨</span>
          <span>Wind speed</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          Scroll horizontally to see more hours
        </p>
      </div>
    </div>
  );
}
