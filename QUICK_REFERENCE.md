# ⚡ Quick Reference Card

## 🚀 Start in 3 Commands
```bash
cp .env.example .env.local  # Create config (add your API key)
pnpm install                 # Install dependencies
pnpm dev                     # Run app → http://localhost:3000
```

## 🔑 Get API Key
1. Visit: https://openweathermap.org/api
2. Sign up (free)
3. Copy API key from dashboard
4. Add to `.env.local`: `OPENWEATHERMAP_API_KEY=your_key_here`

## 🎯 ChatGPT Queries
```
"What's the weather in London?"
"5-day forecast for Tokyo"
"Compare Paris and Berlin weather"
"Temperature in Miami in Fahrenheit"
```

## 📂 Key Files

| File | Purpose |
|------|---------|
| `lib/weather-service.ts` | Weather API logic |
| `app/mcp/route.ts` | ChatGPT tools |
| `app/page.tsx` | Main UI |
| `app/components/` | UI components |
| `.env.local` | Your API key (create this) |

## 🛠️ MCP Tools

```typescript
get_current_weather(location, units)
get_weather_forecast(location, days, units)
compare_weather(location1, location2, units)
```

## 🎨 Components

```typescript
<WeatherDisplay {...weatherData} />
<ForecastCard {...dayData} />
<WeatherComparison location1={...} location2={...} />
<LoadingSpinner message="..." />
<ErrorMessage title="..." message="..." />
```

## 🌐 Deploy to Vercel
1. Push code to GitHub
2. Import in Vercel
3. Add env var: `OPENWEATHERMAP_API_KEY`
4. Deploy
5. Connect to ChatGPT: `https://your-app.vercel.app/mcp`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "API key not configured" | Create `.env.local` and add key |
| "Invalid API key" | Wait 10 mins for key activation |
| "Location not found" | Use full name: "London, UK" |
| Port 3000 in use | `PORT=3001 pnpm dev` |

## 📊 API Limits (Free Tier)
- 1,000 calls/day
- 60 calls/minute
- Caching: 10min (current), 30min (forecast)

## 📚 Documentation

| Doc | When to Use |
|-----|-------------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | First time setup |
| [README.md](./README.md) | Full reference |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Big picture |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | This card |

## 💻 Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Run production build

# View
open http://localhost:3000        # Main app
open http://localhost:3000/mcp    # MCP endpoint
```

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| https://openweathermap.org/api | Get API key |
| https://developers.openai.com/apps-sdk | ChatGPT SDK docs |
| https://chatgpt.com/#settings/Connectors | Connect to ChatGPT |
| https://vercel.com | Deploy (free) |

## 📦 Project Structure (Simplified)

```
weather-demo-nextjs-mcp/
├── app/
│   ├── components/      # UI components
│   ├── mcp/route.ts     # ChatGPT integration
│   └── page.tsx         # Main page
├── lib/
│   └── weather-service.ts  # API logic
├── .env.local          # Your API key (git-ignored)
└── .env.example        # Template
```

## 🎯 Testing Checklist

- [ ] App loads at localhost:3000
- [ ] No console errors
- [ ] Can see welcome screen
- [ ] API key is configured
- [ ] Weather data displays correctly
- [ ] Dark mode works
- [ ] Responsive on mobile
- [ ] Error handling works

## 🔐 Security Notes

✅ Keep `.env.local` secret (never commit)
✅ API keys in environment variables only
✅ HTTPS for all API calls
✅ No hardcoded credentials

## ⚙️ Environment Variables

```bash
# Required
OPENWEATHERMAP_API_KEY=abc123...

# Optional (for alternative provider)
WEATHERAPI_KEY=xyz789...
```

## 🎨 Customization Tips

**Colors**: Edit Tailwind classes in components
**Layout**: Modify `app/page.tsx`
**Styling**: Update `app/globals.css`
**API**: Swap in `lib/weather-service.ts`

## 📱 Mobile Testing

```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
ipconfig               # Windows

# Access from phone
http://YOUR_IP:3000
```

## 🔄 Update Flow

```
Edit code → Save → Auto-reload → See changes
```

## 🎓 Learn More

- OpenWeatherMap: https://openweathermap.org/api
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- MCP: https://modelcontextprotocol.io

---

**Need help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) or [README.md](./README.md)

**Ready to deploy?** See "Deploy to Vercel" section in [README.md](./README.md)

🌤️ Happy weather tracking!

