import { NextRequest, NextResponse } from "next/server";
import { getWeatherForecast } from "@/lib/weather-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");
    const days = parseInt(searchParams.get("days") || "5");
    const units = (searchParams.get("units") as "celsius" | "fahrenheit") || "celsius";

    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

    if (days < 1 || days > 7) {
      return NextResponse.json(
        { error: "Days must be between 1 and 7" },
        { status: 400 }
      );
    }

    const forecast = await getWeatherForecast(location, days, units);

    return NextResponse.json({
      type: "forecast",
      ...forecast,
      units,
    });
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    return NextResponse.json(
      {
        type: "error",
        error: error instanceof Error ? error.message : "Failed to fetch forecast data",
      },
      { status: 500 }
    );
  }
}
