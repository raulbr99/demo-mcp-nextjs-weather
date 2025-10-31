import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/weather-service";

/**
 * Test endpoint to verify weather API is working
 * Visit: http://localhost:3000/api/test-weather
 */
export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json({
        error: "API key not configured",
        message: "Please add your OpenWeatherMap API key to .env.local",
        instructions: [
          "1. Get free API key from: https://openweathermap.org/api",
          "2. Create .env.local file in project root",
          "3. Add: OPENWEATHERMAP_API_KEY=your_actual_key",
          "4. Restart dev server"
        ]
      }, { status: 500 });
    }

    // Test fetching weather for London
    const weather = await getCurrentWeather("London", "celsius");
    
    return NextResponse.json({
      success: true,
      message: "Weather API is working!",
      sampleData: weather,
      apiKeyConfigured: true,
    });
    
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch weather",
      message: error instanceof Error ? error.message : "Unknown error",
      possibleCauses: [
        "API key not activated yet (takes 10 minutes)",
        "Invalid API key",
        "Network connection issue",
        "OpenWeatherMap API is down"
      ]
    }, { status: 500 });
  }
}

