"use client";

import { getWeatherIconUrl } from "@/lib/weather-service";

export interface ForecastCardProps {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  units?: "celsius" | "fahrenheit";
}

export function ForecastCard({
  date,
  tempMin,
  tempMax,
  description,
  icon,
  units = "celsius",
}: ForecastCardProps) {
  const unitSymbol = units === "celsius" ? "°C" : "°F";
  
  // Format date to readable format
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const monthDay = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
      {/* Day */}
      <div className="text-center mb-2">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {dayName}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {monthDay}
        </div>
      </div>

      {/* Weather Icon */}
      <div className="flex justify-center mb-2">
        <img
          src={getWeatherIconUrl(icon)}
          alt={description}
          className="w-16 h-16"
        />
      </div>

      {/* Temperature Range */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {tempMax}{unitSymbol}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {tempMin}{unitSymbol}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="text-center">
        <p className="text-xs capitalize text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

