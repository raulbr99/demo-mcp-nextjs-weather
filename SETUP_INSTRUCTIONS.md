# Turno Booking System - Setup Instructions

This is a ChatGPT-integrated booking management system built with Next.js 15 and the Model Context Protocol (MCP).

## 🎯 What Changed

The application has been completely transformed from a weather app to a booking management system called **Turno**:

### New Features
- ✅ **Service Management**: List and view available booking services
- ✅ **Booking Creation**: Create new appointments through ChatGPT
- ✅ **Booking Management**: View, filter, and cancel bookings
- ✅ **Availability Checking**: Check available time slots for services
- ✅ **Booking Statistics**: View booking analytics and metrics
- ✅ **Multi-status Support**: pending, confirmed, cancelled, completed

### New Components
- `ServiceCard` - Display service information
- `BookingCard` - Display booking details
- `AvailabilityDisplay` - Show available time slots
- `BookingStats` - Display booking statistics

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and update it with your Turno API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Turno API key:

```env
TURNO_API_BASE_URL=https://xavgmcqkeqfodloknnbr.supabase.co/functions/v1/make-server-8141ccf4
TURNO_API_KEY=your_actual_api_key_here
```

### 3. Get Your Turno API Key

To get your API key:

1. Sign up/sign in to your Turno account
2. Navigate to your dashboard
3. Go to API Keys section
4. Create a new API key with these permissions:
   - `bookings:read`
   - `bookings:write`
   - `services:read`
   - `services:write`
5. Copy the API key (it starts with `tb_...`)
6. Paste it in your `.env` file

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or 3002 if 3000 is in use).

## 🤖 ChatGPT Integration

### Available Tools

The system provides the following tools for ChatGPT:

1. **list_services** - Get all available booking services
   ```
   "Show me available services"
   "What services do you offer?"
   ```

2. **create_booking** - Create a new appointment
   ```
   "Book a consultation for John Doe at john@example.com on 2025-01-25 at 14:00"
   "Create a booking for service ID abc123"
   ```

3. **list_bookings** - View bookings with filters
   ```
   "Show my bookings for today"
   "List all confirmed bookings"
   "Show bookings between Jan 1 and Jan 31"
   ```

4. **check_availability** - Check available time slots
   ```
   "Check availability for service xyz on 2025-01-25"
   "What times are available for consultation tomorrow?"
   ```

5. **get_booking_details** - View specific booking
   ```
   "Show me details for booking ID 12345"
   ```

6. **cancel_booking** - Cancel an appointment
   ```
   "Cancel booking ID 12345"
   "Cancel my appointment because I'm sick"
   ```

7. **get_booking_stats** - View booking statistics
   ```
   "Show me booking statistics"
   "How many bookings do I have this month?"
   ```

### Connecting to ChatGPT

1. Deploy your app to a public URL (Vercel, Netlify, etc.)
2. In ChatGPT, go to Settings → Integrations → MCP
3. Add your deployment URL + `/mcp` endpoint
4. Start using natural language to manage bookings!

## 📁 Project Structure

```
app/
├── components/
│   ├── ServiceCard.tsx          # Service display component
│   ├── BookingCard.tsx          # Booking display component
│   ├── AvailabilityDisplay.tsx  # Availability slots display
│   ├── BookingStats.tsx         # Statistics display
│   ├── LoadingSpinner.tsx       # Loading indicator
│   └── ErrorMessage.tsx         # Error display
├── mcp/
│   └── route.ts                 # MCP endpoint (ChatGPT integration)
├── page.tsx                     # Main app page
└── layout.tsx                   # App layout with metadata

lib/
└── booking-service.ts           # Turno API integration service
```

## 🔌 API Endpoints

The Turno API provides these endpoints:

- `GET /api/services` - List services
- `POST /api/services` - Create service
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

See `lib/api.json` for complete API documentation.

## 🎨 UI Features

- **Dark Mode Support** - Automatic dark/light theme switching
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Status Colors** - Visual indicators for booking status
- **Animations** - Smooth fade-in animations

## 🧪 Testing

To test the integration locally:

1. Ensure your API key is correctly configured
2. Start the dev server
3. Navigate to `http://localhost:3002`
4. You'll see the welcome screen with example commands
5. To test with real data, you'll need to use ChatGPT integration

## 📝 Example Usage

### List Services
```
User: "Show me available services"
ChatGPT: *displays ServiceCard components with all services*
```

### Create Booking
```
User: "Book a consultation for Jane Smith on January 25th at 2 PM"
ChatGPT: *creates booking and shows confirmation with BookingCard*
```

### Check Availability
```
User: "What times are available for consultation on January 25th?"
ChatGPT: *displays AvailabilityDisplay with available slots*
```

## 🐛 Troubleshooting

### CSS Not Loading
- The assetPrefix issue has been fixed in `next.config.ts`
- CSS should now load correctly on all ports

### API Key Issues
- Ensure your API key starts with `tb_`
- Check that it has the required permissions
- Verify the BASE_URL is correct

### Port Conflicts
- The app will automatically use port 3002 if 3000 is occupied
- You can kill the process on port 3000: `kill <PID>`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `TURNO_API_BASE_URL`
   - `TURNO_API_KEY`
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

```
TURNO_API_BASE_URL=https://xavgmcqkeqfodloknnbr.supabase.co/functions/v1/make-server-8141ccf4
TURNO_API_KEY=your_production_api_key
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Turno API Documentation](lib/api.json)

## 🎉 You're All Set!

Your Turno booking system is now ready to use. Start by configuring your API key and exploring the features through ChatGPT!
