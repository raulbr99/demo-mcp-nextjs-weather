"use client";

import { WeatherDisplay, WeatherDisplayProps } from "./WeatherDisplay";

export interface WeatherComparisonProps {
  location1: WeatherDisplayProps;
  location2: WeatherDisplayProps;
  tempDifference: number;
  humidityDifference: number;
  units?: "celsius" | "fahrenheit";
}

export function WeatherComparison({
  location1,
  location2,
  tempDifference,
  humidityDifference,
  units = "celsius",
}: WeatherComparisonProps) {
  const unitSymbol = units === "celsius" ? "°C" : "°F";

  const warmerLocation =
    location1.temperature > location2.temperature
      ? location1.location
      : location2.location;
  const moreHumidLocation =
    location1.humidity > location2.humidity
      ? location1.location
      : location2.location;

  return (
    <div className="space-y-6">
      {/* Comparison Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 shadow-md border border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Weather Comparison
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{warmerLocation}</span> is warmer by{" "}
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {tempDifference.toFixed(1)}
              {unitSymbol}
            </span>
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{moreHumidLocation}</span> has{" "}
            {humidityDifference > 0 ? "more" : "similar"} humidity
            {humidityDifference > 0 && (
              <>
                {" "}
                by{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {humidityDifference}%
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <WeatherDisplay {...location1} units={units} />
        <WeatherDisplay {...location2} units={units} />
      </div>
    </div>
  );
}

