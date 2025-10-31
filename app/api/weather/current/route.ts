import { NextRequest, NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/weather-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");
    const units = (searchParams.get("units") as "celsius" | "fahrenheit") || "celsius";

    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

    const weather = await getCurrentWeather(location, units);

    return NextResponse.json({
      type: "current_weather",
      ...weather,
      units,
    });
  } catch (error) {
    console.error("Error fetching current weather:", error);
    return NextResponse.json(
      {
        type: "error",
        error: error instanceof Error ? error.message : "Failed to fetch weather data",
      },
      { status: 500 }
    );
  }
}
