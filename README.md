# Weather Forecast App with ChatGPT Integration

A Next.js weather application integrated with ChatGPT using the OpenAI Apps SDK and Model Context Protocol (MCP). Get real-time weather information and forecasts through natural conversation.

## Features

### Core Weather Functionality
- **Current Weather**: Get real-time weather data for any city worldwide
- **Weather Forecast**: View 5-7 day weather forecasts with daily breakdowns
- **Weather Comparison**: Compare weather conditions between two locations
- **Multi-Unit Support**: Display temperatures in Celsius or Fahrenheit
- **Rich Weather Details**: Temperature, feels-like, humidity, wind speed, pressure, and weather conditions

### ChatGPT Integration
- Natural language weather queries through ChatGPT
- Interactive weather widgets displayed natively in ChatGPT
- MCP server exposing three weather tools:
  - `get_current_weather`: Fetch current weather for a location
  - `get_weather_forecast`: Get multi-day weather forecasts
  - `compare_weather`: Compare weather between two cities

### UI Components
- **WeatherDisplay**: Beautiful current weather card with all details
- **ForecastCard**: Daily forecast cards with temperature ranges
- **WeatherComparison**: Side-by-side weather comparison view
- **LoadingSpinner**: Elegant loading states
- **ErrorMessage**: User-friendly error handling

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **Package Manager**: npm or pnpm
3. **OpenWeatherMap API Key**: Free tier available
4. **ChatGPT Access**: Developer mode for MCP server connection (optional for standalone use)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd weather-demo-nextjs-mcp
pnpm install
# or
npm install
```

### 2. Get Your Weather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key

**Alternative**: You can use [WeatherAPI.com](https://www.weatherapi.com/signup.aspx) instead by modifying the service module.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Never commit `.env.local` to version control!

### 4. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Connect to ChatGPT (Optional)

The MCP server is available at:
```
http://localhost:3000/mcp
```

**For Production**:
1. Deploy to Vercel (see Deployment section below)
2. Get your production URL (e.g., `https://your-app.vercel.app`)
3. In ChatGPT, go to **Settings → [Connectors](https://chatgpt.com/#settings/Connectors) → Create**
4. Add your MCP server URL: `https://your-app.vercel.app/mcp`

**Note**: Connecting MCP servers to ChatGPT requires developer mode access. See the [connection guide](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt) for details.

## Usage Examples

### Using with ChatGPT

Once connected to ChatGPT, try these natural language queries:

```
"What's the weather like in London?"
"Show me a 5-day forecast for Tokyo"
"Compare the weather in New York and Los Angeles"
"Is it warmer in Paris or Berlin right now?"
"What's the temperature in Miami in Fahrenheit?"
```

### Programmatic Usage

You can also use the weather service directly in your code:

```typescript
import { getCurrentWeather, getWeatherForecast, compareWeather } from '@/lib/weather-service';

// Get current weather
const weather = await getCurrentWeather('London', 'celsius');

// Get 7-day forecast
const forecast = await getWeatherForecast('Tokyo', 7, 'fahrenheit');

// Compare two locations
const comparison = await compareWeather('New York', 'Paris', 'celsius');
```

## Project Structure

```
weather-demo-nextjs-mcp/
├── app/
│   ├── components/           # React components
│   │   ├── WeatherDisplay.tsx       # Current weather card
│   │   ├── ForecastCard.tsx         # Forecast day card
│   │   ├── WeatherComparison.tsx    # Comparison view
│   │   ├── LoadingSpinner.tsx       # Loading state
│   │   └── ErrorMessage.tsx         # Error display
│   ├── hooks/                # Custom React hooks
│   ├── mcp/
│   │   └── route.ts          # MCP server with weather tools
│   ├── layout.tsx            # Root layout with SDK bootstrap
│   ├── page.tsx              # Main weather page
│   └── globals.css           # Global styles
├── lib/
│   └── weather-service.ts    # Weather API integration
├── .env.example              # Environment variables template
├── .env.local                # Your API keys (create this)
├── middleware.ts             # CORS handling for RSC
├── next.config.ts            # Next.js configuration
└── package.json              # Dependencies
```

## API Reference

### Weather Service Functions

#### `getCurrentWeather(location, units)`

Fetches current weather data for a location.

**Parameters:**
- `location` (string): City name or location (e.g., "London", "New York, US")
- `units` (string): "celsius" or "fahrenheit" (default: "celsius")

**Returns:** `Promise<WeatherData>`

#### `getWeatherForecast(location, days, units)`

Fetches weather forecast for upcoming days.

**Parameters:**
- `location` (string): City name or location
- `days` (number): Number of forecast days, 1-7 (default: 5)
- `units` (string): "celsius" or "fahrenheit" (default: "celsius")

**Returns:** `Promise<ForecastData>`

#### `compareWeather(location1, location2, units)`

Compares weather between two locations.

**Parameters:**
- `location1` (string): First city name
- `location2` (string): Second city name
- `units` (string): "celsius" or "fahrenheit" (default: "celsius")

**Returns:** `Promise<ComparisonData>`

### MCP Tools

#### `get_current_weather`
- **Description**: Get current weather for any location
- **Input**: `location` (string), `units` (enum)
- **Output**: Current weather data with widget rendering

#### `get_weather_forecast`
- **Description**: Get multi-day weather forecast
- **Input**: `location` (string), `days` (number 1-7), `units` (enum)
- **Output**: Daily forecast data with widget rendering

#### `compare_weather`
- **Description**: Compare weather between two locations
- **Input**: `location1` (string), `location2` (string), `units` (enum)
- **Output**: Comparison data with side-by-side widget rendering

## Technical Details

### Weather Data Source
- **Provider**: OpenWeatherMap API
- **Free Tier**: 1,000 calls/day, 60 calls/minute
- **Data Refresh**: Current weather cached for 10 minutes, forecasts for 30 minutes
- **Coverage**: Global city coverage

### MCP Integration
This app uses the Model Context Protocol to expose weather tools to ChatGPT:

1. **Tool Registration**: Three weather tools registered in `app/mcp/route.ts`
2. **Resource Widgets**: HTML widgets for rich weather visualization
3. **Metadata**: OpenAI-specific metadata for tool invocation states
4. **Error Handling**: Graceful error responses for invalid locations or API issues

### Next.js Features Used
- **App Router**: Next.js 15+ app directory structure
- **Server Components**: Efficient data fetching
- **Client Components**: Interactive UI with React hooks
- **Turbopack**: Fast development and build times
- **Tailwind CSS**: Utility-first styling with dark mode support

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Click the Deploy button:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

3. Add your environment variable:
   - Go to Project Settings → Environment Variables
   - Add `OPENWEATHERMAP_API_KEY` with your API key

4. Deploy!

The app will automatically detect Vercel environment variables and configure URLs correctly.

### Manual Deployment

For other platforms, ensure:
- Environment variable `OPENWEATHERMAP_API_KEY` is set
- Node.js 18+ runtime is available
- Build command: `npm run build`
- Start command: `npm start`
- Output directory: `.next`

## Error Handling

The app includes comprehensive error handling:

- **Invalid Location**: Clear error message when city is not found
- **API Errors**: Graceful handling of API failures
- **Missing API Key**: Helpful error message with setup instructions
- **Rate Limiting**: Respects OpenWeatherMap API limits with caching
- **Network Issues**: User-friendly error display

## Customization

### Using a Different Weather API

To use WeatherAPI.com or another provider:

1. Update `lib/weather-service.ts` with the new API endpoints
2. Modify the response parsing logic
3. Update environment variables in `.env.example` and `.env.local`

### Styling

The app uses Tailwind CSS with dark mode support. Customize:
- Colors: Modify Tailwind classes in components
- Layout: Adjust component structure in `app/page.tsx`
- Theme: Update `app/globals.css` for global styles

### Adding New Weather Features

1. Add function to `lib/weather-service.ts`
2. Register new tool in `app/mcp/route.ts`
3. Create UI component in `app/components/`
4. Update `app/page.tsx` to handle new data type

## Troubleshooting

### "API Key not configured" Error
- Verify `.env.local` exists in project root
- Check that variable name is exactly `OPENWEATHERMAP_API_KEY`
- Restart development server after adding environment variables

### "Location not found" Error
- Try full city name with country code (e.g., "London, UK")
- Check spelling of city name
- Use more specific location (state/province for US/Canada cities)

### Widgets Not Showing in ChatGPT
- Ensure your app is deployed to a public URL
- Verify MCP server URL ends with `/mcp`
- Check that ChatGPT has developer mode enabled
- Review connection status in ChatGPT settings

### API Rate Limit Issues
- Free tier: 1,000 calls/day
- Caching reduces API calls (10 min for current, 30 min for forecast)
- Consider upgrading OpenWeatherMap plan for high-traffic apps

## Resources

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT License - feel free to use this project as a template for your own ChatGPT-integrated applications!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review [OpenWeatherMap API docs](https://openweathermap.org/api)
- Open an issue on GitHub

---

Built with ❤️ using Next.js, OpenAI Apps SDK, and OpenWeatherMap API
