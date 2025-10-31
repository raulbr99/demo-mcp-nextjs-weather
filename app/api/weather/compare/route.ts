import { NextRequest, NextResponse } from "next/server";
import { compareWeather } from "@/lib/weather-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location1 = searchParams.get("location1");
    const location2 = searchParams.get("location2");
    const units = (searchParams.get("units") as "celsius" | "fahrenheit") || "celsius";

    if (!location1 || !location2) {
      return NextResponse.json(
        { error: "Both location1 and location2 parameters are required" },
        { status: 400 }
      );
    }

    const comparison = await compareWeather(location1, location2, units);

    return NextResponse.json({
      type: "comparison",
      ...comparison,
      units,
    });
  } catch (error) {
    console.error("Error comparing weather:", error);
    return NextResponse.json(
      {
        type: "error",
        error: error instanceof Error ? error.message : "Failed to compare weather data",
      },
      { status: 500 }
    );
  }
}
