import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  getCurrentWeather,
  getWeatherForecast,
  compareWeather,
} from "@/lib/weather-service";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  // Widget for current weather
  const currentWeatherWidget: ContentWidget = {
    id: "get_current_weather",
    title: "Current Weather",
    templateUri: "ui://widget/current-weather-template.html",
    invoking: "Fetching current weather...",
    invoked: "Weather data loaded",
    html: html,
    description: "Displays current weather for a location",
    widgetDomain: "https://openweathermap.org",
  };

  // Widget for weather forecast
  const forecastWidget: ContentWidget = {
    id: "get_weather_forecast",
    title: "Weather Forecast",
    templateUri: "ui://widget/forecast-template.html",
    invoking: "Fetching weather forecast...",
    invoked: "Forecast loaded",
    html: html,
    description: "Displays weather forecast for upcoming days",
    widgetDomain: "https://openweathermap.org",
  };

  // Widget for weather comparison
  const comparisonWidget: ContentWidget = {
    id: "compare_weather",
    title: "Weather Comparison",
    templateUri: "ui://widget/comparison-template.html",
    invoking: "Comparing weather...",
    invoked: "Comparison ready",
    html: html,
    description: "Compares weather between two locations",
    widgetDomain: "https://openweathermap.org",
  };

  // Register resources for each widget
  server.registerResource(
    "current-weather-widget",
    currentWeatherWidget.templateUri,
    {
      title: currentWeatherWidget.title,
      description: currentWeatherWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": currentWeatherWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${currentWeatherWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": currentWeatherWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": currentWeatherWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerResource(
    "forecast-widget",
    forecastWidget.templateUri,
    {
      title: forecastWidget.title,
      description: forecastWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": forecastWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${forecastWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": forecastWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": forecastWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerResource(
    "comparison-widget",
    comparisonWidget.templateUri,
    {
      title: comparisonWidget.title,
      description: comparisonWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": comparisonWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${comparisonWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": comparisonWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": comparisonWidget.widgetDomain,
          },
        },
      ],
    })
  );

  // Tool: Get Current Weather
  server.registerTool(
    currentWeatherWidget.id,
    {
      title: currentWeatherWidget.title,
      description:
        "Get current weather information for any city or location. Returns temperature, conditions, humidity, wind speed, and more.",
      inputSchema: {
        location: z
          .string()
          .describe(
            "City name or location (e.g., 'London', 'New York', 'Tokyo')"
          ),
        units: z
          .enum(["celsius", "fahrenheit"])
          .default("celsius")
          .describe("Temperature units to use"),
      },
      _meta: widgetMeta(currentWeatherWidget),
    },
    async ({ location, units = "celsius" }) => {
      try {
        const weather = await getCurrentWeather(location, units);
        return {
          content: [
            {
              type: "text",
              text: `Current weather in ${weather.location}, ${weather.country}:
Temperature: ${weather.temperature}°${units === "celsius" ? "C" : "F"} (feels like ${weather.feelsLike}°${units === "celsius" ? "C" : "F"})
Conditions: ${weather.description}
Humidity: ${weather.humidity}%
Wind Speed: ${weather.windSpeed} ${units === "celsius" ? "m/s" : "mph"}
Pressure: ${weather.pressure} hPa`,
            },
          ],
          structuredContent: {
            type: "current_weather",
            ...weather,
            units,
          },
          _meta: widgetMeta(currentWeatherWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching weather: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          structuredContent: {
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );

  // Tool: Get Weather Forecast
  server.registerTool(
    forecastWidget.id,
    {
      title: forecastWidget.title,
      description:
        "Get weather forecast for upcoming days for any city or location. Returns daily forecasts with temperature ranges and conditions.",
      inputSchema: {
        location: z
          .string()
          .describe(
            "City name or location (e.g., 'London', 'New York', 'Tokyo')"
          ),
        days: z
          .number()
          .min(1)
          .max(7)
          .default(5)
          .describe("Number of forecast days (1-7)"),
        units: z
          .enum(["celsius", "fahrenheit"])
          .default("celsius")
          .describe("Temperature units to use"),
      },
      _meta: widgetMeta(forecastWidget),
    },
    async ({ location, days = 5, units = "celsius" }) => {
      try {
        const forecast = await getWeatherForecast(location, days, units);
        const forecastText = forecast.forecast
          .map(
            (day) =>
              `${day.date}: ${day.tempMin}-${day.tempMax}°${units === "celsius" ? "C" : "F"}, ${day.description}`
          )
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `${days}-day forecast for ${forecast.location}, ${forecast.country}:\n${forecastText}`,
            },
          ],
          structuredContent: {
            type: "forecast",
            ...forecast,
            units,
          },
          _meta: widgetMeta(forecastWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching forecast: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          structuredContent: {
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );

  // Tool: Compare Weather
  server.registerTool(
    comparisonWidget.id,
    {
      title: comparisonWidget.title,
      description:
        "Compare current weather conditions between two different cities or locations. Shows temperature and humidity differences.",
      inputSchema: {
        location1: z
          .string()
          .describe("First city or location to compare"),
        location2: z
          .string()
          .describe("Second city or location to compare"),
        units: z
          .enum(["celsius", "fahrenheit"])
          .default("celsius")
          .describe("Temperature units to use"),
      },
      _meta: widgetMeta(comparisonWidget),
    },
    async ({ location1, location2, units = "celsius" }) => {
      try {
        const comparison = await compareWeather(location1, location2, units);
        const unitSymbol = units === "celsius" ? "C" : "F";

        return {
          content: [
            {
              type: "text",
              text: `Weather Comparison:

${comparison.location1.location}: ${comparison.location1.temperature}°${unitSymbol}, ${comparison.location1.description}
${comparison.location2.location}: ${comparison.location2.temperature}°${unitSymbol}, ${comparison.location2.description}

Temperature difference: ${comparison.tempDifference.toFixed(1)}°${unitSymbol}
Humidity difference: ${comparison.humidityDifference}%`,
            },
          ],
          structuredContent: {
            type: "comparison",
            ...comparison,
            units,
          },
          _meta: widgetMeta(comparisonWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error comparing weather: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          structuredContent: {
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          isError: true,
        };
      }
    }
  );
});

export const GET = handler;
export const POST = handler;
