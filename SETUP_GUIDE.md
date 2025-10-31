# Quick Setup Guide

Follow these steps to get your weather app running in less than 5 minutes!

## Step 1: Get Your API Key (2 minutes)

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **"Sign Up"** (top right)
3. Create a free account:
   - Enter your email and create a password
   - Confirm your email address
4. After login, go to **"API keys"** tab
5. You'll see a default API key already generated - copy it!

**Note**: New API keys can take up to 2 hours to activate, but usually work within 10 minutes.

## Step 2: Configure the App (1 minute)

1. In your project directory, create a `.env.local` file:

```bash
# Mac/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

2. Open `.env.local` in your text editor

3. Replace `your_api_key_here` with your actual API key from Step 1:

```env
OPENWEATHERMAP_API_KEY=abc123your_actual_key_here456def
```

4. Save the file

## Step 3: Install Dependencies (1 minute)

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

## Step 4: Start the App (30 seconds)

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

## Step 5: Test It! (30 seconds)

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see the weather app homepage
3. The app is now ready to connect to ChatGPT!

## Connecting to ChatGPT (Optional)

### For Local Testing:
1. Your MCP server is running at `http://localhost:3000/mcp`
2. This only works on your local machine

### For Production Use:
1. Deploy to Vercel (click Deploy button in README)
2. Add your `OPENWEATHERMAP_API_KEY` in Vercel environment variables
3. Copy your production URL (e.g., `https://your-app.vercel.app`)
4. In ChatGPT:
   - Go to **Settings → Connectors → Create**
   - Add: `https://your-app.vercel.app/mcp`
   - Save

### Try These Queries in ChatGPT:
- "What's the weather in London?"
- "Show me a 5-day forecast for Tokyo"
- "Compare weather in New York and Paris"
- "Is it warmer in Miami or Seattle?"

## Troubleshooting

### "API Key not configured" error
- Make sure `.env.local` exists in your project root (same folder as `package.json`)
- Check that the variable name is exactly: `OPENWEATHERMAP_API_KEY`
- Restart your dev server: Stop it (Ctrl+C) and run `pnpm dev` again

### "Invalid API key" error
- Wait 10 minutes - new keys need time to activate
- Check you copied the entire key (no spaces)
- Try regenerating the key on OpenWeatherMap

### "Location not found" error
- Try full city name: "London, UK" instead of just "London"
- Check spelling
- Use major cities for better results

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 pnpm dev
```

## Need Help?

- Check the full [README.md](./README.md) for detailed documentation
- Review [OpenWeatherMap API docs](https://openweathermap.org/api)
- Check [ChatGPT Apps SDK docs](https://developers.openai.com/apps-sdk)

## Next Steps

Once everything is working:
- ✅ Customize the UI colors and styling
- ✅ Add more weather features (hourly forecast, weather alerts)
- ✅ Deploy to Vercel for free hosting
- ✅ Share your MCP server URL with your team

Enjoy your weather app! 🌤️

