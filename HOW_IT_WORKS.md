# How It Works: Weather App with ChatGPT Integration

## Overview

This application is a **Next.js weather app** that works as a **ChatGPT widget** using the **OpenAI Apps SDK** and **MCP (Model Context Protocol)**. When you ask ChatGPT about weather, it displays a beautiful interactive widget instead of just text.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                    │
│              "What's the weather in London?"                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CHATGPT                                   │
│  1. Receives natural language query                             │
│  2. Recognizes it needs weather tool                            │
│  3. Calls MCP server endpoint                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   YOUR VERCEL APP                                │
│                   https://your-app.vercel.app/mcp               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MCP SERVER (app/mcp/route.ts)                           │  │
│  │  - Receives tool call from ChatGPT                       │  │
│  │  - Calls OpenWeatherMap API                              │  │
│  │  - Returns data + HTML widget URL                        │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ↓                                            │
│  Returns to ChatGPT:                                            │
│  {                                                               │
│    content: "Text response...",                                 │
│    structuredContent: { weather data },  ← Data for widget     │
│    _meta: { templateUri: "widget URL" }  ← Widget HTML URL     │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                        CHATGPT                                   │
│  4. Receives response from MCP server                           │
│  5. Loads widget HTML from templateUri                          │
│  6. Injects structuredContent into widget                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   WIDGET (Next.js App)                          │
│                   Loaded in iframe in ChatGPT                   │
│                                                                  │
│  1. Next.js app loads                                           │
│  2. useWidgetProps() reads window.openai.toolOutput            │
│  3. Receives: { type: "current_weather", temp: 24, ... }       │
│  4. Renders beautiful weather display                          │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. MCP Server (`/app/mcp/route.ts`)

**Purpose:** Acts as the bridge between ChatGPT and weather data.

**What it does:**
- Registers 3 tools with ChatGPT:
  - `get_current_weather` - Current weather for a city
  - `get_weather_forecast` - 5-7 day forecast
  - `compare_weather` - Compare two cities
- Fetches data from OpenWeatherMap API
- Returns data in two formats:
  - **Text format** - For ChatGPT to display as text
  - **Structured format** - For the widget to render visually

**Key settings:**
```typescript
_meta: {
  "openai/outputTemplate": "ui://widget/...",     // Widget URL
  "openai/widgetAccessible": true,                 // MUST be true!
  "openai/resultCanProduceWidget": true            // Enables widget
}
```

### 2. Next.js Widget (`/app/page.tsx`)

**Purpose:** Beautiful UI that displays weather data inside ChatGPT.

**How it receives data:**

```typescript
// ChatGPT injects data into window.openai.toolOutput
const toolOutput = useWidgetProps<Record<string, unknown>>();

// toolOutput directly contains the weather data:
// { type: "current_weather", location: "London", temperature: 15, ... }
const weatherData = toolOutput as WeatherResult | null;
```

**Important:** The data comes **directly** in `toolOutput`, NOT in `toolOutput.structuredContent`!

### 3. OpenAI Apps SDK Hooks (`/app/hooks/`)

These hooks connect your Next.js app to ChatGPT:

- `useWidgetProps()` - Gets data from ChatGPT
- `useIsChatGptApp()` - Detects if running in ChatGPT
- `useDisplayMode()` - Gets display mode (inline/fullscreen)
- `useMaxHeight()` - Gets available height
- `useRequestDisplayMode()` - Request display mode change

### 4. Weather Service (`/lib/weather-service.ts`)

**Purpose:** Handles all OpenWeatherMap API calls.

**Functions:**
- `getCurrentWeather(location, units)` - Fetch current weather
- `getWeatherForecast(location, days, units)` - Fetch forecast
- `compareWeather(location1, location2, units)` - Compare cities

## Data Flow in Detail

### Step 1: User asks ChatGPT
```
User: "What's the weather in London?"
```

### Step 2: ChatGPT calls MCP server
```http
POST https://your-app.vercel.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "get_current_weather",
    "arguments": {
      "location": "London",
      "units": "celsius"
    }
  }
}
```

### Step 3: MCP server responds
```json
{
  "content": [
    {
      "type": "text",
      "text": "Current weather in London, UK:\nTemperature: 15°C..."
    }
  ],
  "structuredContent": {
    "type": "current_weather",
    "location": "London",
    "country": "UK",
    "temperature": 15,
    "feelsLike": 13,
    "description": "cloudy",
    "humidity": 75,
    "windSpeed": 5.2,
    "pressure": 1013,
    "icon": "04d",
    "units": "celsius"
  },
  "_meta": {
    "openai/outputTemplate": "ui://widget/current-weather-template.html",
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true
  }
}
```

### Step 4: ChatGPT loads widget
ChatGPT:
1. Sees `openai/widgetAccessible: true`
2. Loads HTML from the resource URI
3. Injects `structuredContent` into `window.openai.toolOutput`
4. Displays widget in an iframe

### Step 5: Widget renders
```typescript
// In the widget (page.tsx)
const toolOutput = useWidgetProps();
// toolOutput = { type: "current_weather", location: "London", ... }

if (toolOutput?.type === "current_weather") {
  return <WeatherDisplay {...toolOutput} />;
}
```

## Important Configuration

### 1. ChatGPT Connector Setup

In ChatGPT settings:
1. Go to **Settings** → **Connectors**
2. Add new connector
3. Set URL: `https://your-app.vercel.app/mcp`
4. Protocol: MCP
5. Save

### 2. Environment Variables

```bash
OPENWEATHERMAP_API_KEY=your_api_key_here
```

Get your free API key at: https://openweathermap.org/api

### 3. Vercel Deployment

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repo for automatic deployments
```

### 4. Base URL Configuration (`baseUrl.ts`)

This file determines the URL for your app:

```typescript
export const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://your-app.vercel.app";
```

**Important:** ChatGPT needs to access this URL to load the widget!

## Troubleshooting

### Widget shows but stays empty

**Problem:** `toolOutput` is `null` or `undefined`

**Solutions:**
1. Check `"openai/widgetAccessible": true` in MCP server
2. Verify ChatGPT connector is properly configured
3. Check browser console for errors
4. Verify data is being returned from MCP server

### Widget not appearing at all

**Problem:** ChatGPT shows only text, no widget

**Solutions:**
1. Ensure `"openai/widgetAccessible": true` (NOT false!)
2. Check `"openai/resultCanProduceWidget": true`
3. Verify widget HTML is accessible
4. Check that app is deployed and accessible

### Data not showing in widget

**Problem:** Widget loads but displays welcome screen

**Solutions:**
1. Check that you're reading `toolOutput` directly, not `toolOutput.structuredContent`
2. Verify data structure matches `WeatherResult` interface
3. Check browser console for logs
4. Verify `type` field is correct ("current_weather", "forecast", or "comparison")

## Development vs Production

### Local Development
- Widget loads from `http://localhost:3000`
- Shows welcome screen with search interface
- Can't be used with ChatGPT (not publicly accessible)

### Production (Vercel)
- Widget loads from `https://your-app.vercel.app`
- Works with ChatGPT connector
- Shows data from ChatGPT queries

## Testing

### Test locally (standalone)
```bash
npm run dev
open http://localhost:3000
```
Use the search interface to test weather queries.

### Test with ChatGPT
1. Deploy to Vercel
2. Configure ChatGPT connector
3. Ask: "What's the weather in London?"
4. Widget should appear with data

### Debug in ChatGPT
1. Open DevTools (F12) while widget is showing
2. Check console logs:
```javascript
=== DEBUG INFO ===
isChatGptApp: true
toolOutput: { type: "current_weather", ... }
weatherData: { type: "current_weather", ... }
```

## Common Patterns

### Adding a new weather feature

1. **Add service function** (`lib/weather-service.ts`)
```typescript
export async function getAirQuality(location: string) {
  // Fetch air quality data
}
```

2. **Register MCP tool** (`app/mcp/route.ts`)
```typescript
server.registerTool(
  "get_air_quality",
  { /* schema */ },
  async ({ location }) => {
    const data = await getAirQuality(location);
    return {
      content: [{ type: "text", text: "..." }],
      structuredContent: { type: "air_quality", ...data },
      _meta: widgetMeta(airQualityWidget)
    };
  }
);
```

3. **Add UI component** (`app/components/AirQualityDisplay.tsx`)
```typescript
export function AirQualityDisplay({ aqi, pollutants }) {
  return <div>{/* Display air quality */}</div>;
}
```

4. **Handle in page** (`app/page.tsx`)
```typescript
if (weatherData.type === "air_quality") {
  return <AirQualityDisplay {...weatherData} />;
}
```

## Key Takeaways

1. **MCP Server** = Backend that ChatGPT calls
2. **Widget** = Frontend that ChatGPT displays
3. **toolOutput** = Data ChatGPT injects into widget
4. **structuredContent** = What MCP server returns (becomes toolOutput)
5. **widgetAccessible: true** = REQUIRED for widget to show!

## Resources

- OpenAI Apps SDK: https://developers.openai.com/apps-sdk/
- MCP Protocol: https://modelcontextprotocol.io/
- OpenWeatherMap API: https://openweathermap.org/api
- Vercel Deployment: https://vercel.com/docs

## Support

If the widget isn't working:
1. Check browser console logs
2. Verify `toolOutput` contains data
3. Ensure `widgetAccessible: true`
4. Check Vercel deployment logs
5. Test MCP endpoint directly

---

**Built with:** Next.js 15, OpenAI Apps SDK, MCP Protocol, OpenWeatherMap API
