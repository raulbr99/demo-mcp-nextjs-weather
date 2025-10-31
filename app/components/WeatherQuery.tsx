"use client";

import { useState } from "react";
import { WeatherDisplay } from "./WeatherDisplay";
import { ForecastCard } from "./ForecastCard";
import { WeatherComparison } from "./WeatherComparison";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";

interface WeatherResult {
  type?: "current_weather" | "forecast" | "comparison" | "error";
  location?: string;
  country?: string;
  temperature?: number;
  feelsLike?: number;
  description?: string;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  icon?: string;
  units?: "celsius" | "fahrenheit";
  forecast?: Array<{
    date: string;
    tempMin: number;
    tempMax: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  }>;
  location1?: any;
  location2?: any;
  tempDifference?: number;
  humidityDifference?: number;
  error?: string;
}

export function WeatherQuery() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResult | null>(null);

  const parseQuery = (
    q: string
  ): { action: string; location?: string; location2?: string; days?: number } => {
    const lowerQuery = q.toLowerCase();

    // Detect comparison queries
    if (
      lowerQuery.includes("compare") ||
      (lowerQuery.includes("between") && lowerQuery.includes("and"))
    ) {
      const matches = q.match(/between\s+([^and]+)\s+and\s+(.+)/i);
      if (matches) {
        return {
          action: "compare",
          location: matches[1].trim(),
          location2: matches[2].trim(),
        };
      }
      const compareMatch = q.match(/compare\s+([^and]+)\s+and\s+(.+)/i);
      if (compareMatch) {
        return {
          action: "compare",
          location: compareMatch[1].trim(),
          location2: compareMatch[2].trim(),
        };
      }
    }

    // Detect forecast queries
    if (lowerQuery.includes("forecast")) {
      const daysMatch = q.match(/(\d+)[\s-]*day/i);
      const days = daysMatch ? parseInt(daysMatch[1]) : 5;
      const locationMatch =
        q.match(/forecast\s+for\s+([^?]+)/i) ||
        q.match(/in\s+([^?]+)/i) ||
        q.match(/for\s+([^?]+)/i);
      return {
        action: "forecast",
        location: locationMatch ? locationMatch[1].trim() : undefined,
        days,
      };
    }

    // Default to current weather
    const locationMatch =
      q.match(/weather\s+in\s+([^?]+)/i) ||
      q.match(/in\s+([^?]+)/i) ||
      q.match(/for\s+([^?]+)/i);
    return {
      action: "current",
      location: locationMatch
        ? locationMatch[1].trim()
        : q.replace(/what'?s?\s+the\s+weather\s*/i, "").trim(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setWeatherData(null);

    try {
      const parsedQuery = parseQuery(query);

      if (!parsedQuery.location) {
        setWeatherData({
          type: "error",
          error: "Please specify a location in your query",
        });
        setLoading(false);
        return;
      }

      if (parsedQuery.action === "compare" && !parsedQuery.location2) {
        setWeatherData({
          type: "error",
          error: "Please specify two locations to compare",
        });
        setLoading(false);
        return;
      }

      let response;

      if (parsedQuery.action === "compare") {
        response = await fetch(
          `/api/weather/compare?location1=${encodeURIComponent(parsedQuery.location)}&location2=${encodeURIComponent(parsedQuery.location2!)}`
        );
      } else if (parsedQuery.action === "forecast") {
        response = await fetch(
          `/api/weather/forecast?location=${encodeURIComponent(parsedQuery.location)}&days=${parsedQuery.days || 5}`
        );
      } else {
        response = await fetch(
          `/api/weather/current?location=${encodeURIComponent(parsedQuery.location)}`
        );
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setWeatherData({
        type: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch weather data",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (!weatherData) {
      return null;
    }

    if (weatherData.type === "error") {
      return (
        <ErrorMessage
          title="Weather Error"
          message={weatherData.error || "An unknown error occurred"}
        />
      );
    }

    if (weatherData.type === "current_weather") {
      return (
        <WeatherDisplay
          location={weatherData.location!}
          country={weatherData.country!}
          temperature={weatherData.temperature!}
          feelsLike={weatherData.feelsLike!}
          description={weatherData.description!}
          humidity={weatherData.humidity!}
          windSpeed={weatherData.windSpeed!}
          pressure={weatherData.pressure!}
          icon={weatherData.icon!}
          units={weatherData.units}
        />
      );
    }

    if (weatherData.type === "forecast" && weatherData.forecast) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {weatherData.location}, {weatherData.country}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {weatherData.forecast.length}-Day Forecast
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <ForecastCard
                key={index}
                date={day.date}
                tempMin={day.tempMin}
                tempMax={day.tempMax}
                description={day.description}
                icon={day.icon}
                units={weatherData.units}
              />
            ))}
          </div>
        </div>
      );
    }

    if (weatherData.type === "comparison") {
      return (
        <WeatherComparison
          location1={weatherData.location1!}
          location2={weatherData.location2!}
          tempDifference={weatherData.tempDifference!}
          humidityDifference={weatherData.humidityDifference!}
          units={weatherData.units}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about the weather... (e.g., 'What's the weather in Tokyo?')"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-semibold">Try asking:</p>
          <ul className="space-y-1 ml-4">
            <li>• "What's the weather in London?"</li>
            <li>• "Show me a 5-day forecast for Tokyo"</li>
            <li>• "Compare weather between New York and Paris"</li>
          </ul>
        </div>
      </form>

      {renderWeatherContent()}
    </div>
  );
}
