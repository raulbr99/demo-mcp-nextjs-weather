"use client";

import Image from "next/image";
import {
  useWidgetProps,
  useMaxHeight,
  useDisplayMode,
  useRequestDisplayMode,
  useIsChatGptApp,
} from "./hooks";
import { WeatherDisplay } from "./components/WeatherDisplay";
import { ForecastCard } from "./components/ForecastCard";
import { WeatherComparison } from "./components/WeatherComparison";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";

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

export default function Home() {
  const toolOutput = useWidgetProps<Record<string, unknown>>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  // The toolOutput directly contains the weather data, not under structuredContent
  const weatherData = toolOutput as WeatherResult | null;

  // Debug: Log the tool output to help troubleshoot
  if (typeof window !== "undefined") {
    console.log("=== DEBUG INFO ===");
    console.log("isChatGptApp:", isChatGptApp);
    console.log("window.openai exists:", !!window.openai);
    console.log("toolOutput:", toolOutput);
    console.log("toolOutput FULL:", JSON.stringify(toolOutput, null, 2));
    console.log("weatherData:", weatherData);
    console.log("displayMode:", displayMode);
    if (window.openai) {
      console.log("window.openai.toolOutput:", (window.openai as any).toolOutput);
      console.log("window.openai.toolOutput FULL:", JSON.stringify((window.openai as any).toolOutput, null, 2));
    }
    console.log("==================");
  }

  const renderWeatherContent = () => {
    if (!weatherData) {
      return (
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Weather Forecast App
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            Ask me about the weather in any city! Try asking:
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 max-w-md">
            <li>• "What's the weather in London?"</li>
            <li>• "Show me a 5-day forecast for Tokyo"</li>
            <li>• "Compare weather between New York and Paris"</li>
          </ul>
        </div>
      );
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

    return <LoadingSpinner />;
  };

  return (
    <div
      className="font-sans min-h-screen p-4 sm:p-8"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
        overflow: "auto",
      }}
    >
      {displayMode !== "fullscreen" && (
        <button
          aria-label="Enter fullscreen"
          className="fixed top-4 right-4 z-50 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => requestDisplayMode("fullscreen")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      )}

      <main className="max-w-6xl mx-auto">
        {!isChatGptApp && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                  This weather app is designed to work with ChatGPT.
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Connect it to ChatGPT to get weather information through
                  natural conversation.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={26}
            priority
          />
        </div>

        <div className="space-y-6">{renderWeatherContent()}</div>

        {!weatherData && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Powered by
              </span>
              <a
                href="https://openweathermap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                OpenWeatherMap
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
