import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  listServices,
  getService,
  createBooking,
  listBookings,
  getBooking,
  getAvailableSlots,
  getTodayBookings,
  getUpcomingBookings,
  getBookingStats,
  updateBooking,
  cancelBooking,
} from "@/lib/booking-service";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

const injectDataIntoHtml = (html: string, data: any) => {
  // Inject the structured content into the HTML before the closing </head> tag
  const injectionScript = `
    <script>
      // Inject tool output data into window.openai
      if (typeof window !== 'undefined') {
        window.openai = window.openai || {};
        window.openai.toolOutput = ${JSON.stringify(data)};

        // Dispatch event to notify the app that data is available
        setTimeout(() => {
          const event = new CustomEvent('openai:set_globals', {
            detail: {
              globals: {
                toolOutput: ${JSON.stringify(data)}
              }
            }
          });
          window.dispatchEvent(event);
        }, 100);
      }
    </script>
  `;

  return html.replace('</head>', `${injectionScript}</head>`);
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

  // Widget for listing services
  const servicesWidget: ContentWidget = {
    id: "list_services",
    title: "Available Services",
    templateUri: "ui://widget/services-template.html",
    invoking: "Loading services...",
    invoked: "Services loaded",
    html: html,
    description: "Displays all available booking services",
    widgetDomain: "turno.app",
  };

  // Widget for creating bookings
  const createBookingWidget: ContentWidget = {
    id: "create_booking",
    title: "Create Booking",
    templateUri: "ui://widget/create-booking-template.html",
    invoking: "Creating booking...",
    invoked: "Booking created",
    html: html,
    description: "Create a new appointment booking",
    widgetDomain: "turno.app",
  };

  // Widget for listing bookings
  const bookingsWidget: ContentWidget = {
    id: "list_bookings",
    title: "My Bookings",
    templateUri: "ui://widget/bookings-template.html",
    invoking: "Loading bookings...",
    invoked: "Bookings loaded",
    html: html,
    description: "View all your bookings and appointments",
    widgetDomain: "turno.app",
  };

  // Widget for checking availability
  const availabilityWidget: ContentWidget = {
    id: "check_availability",
    title: "Check Availability",
    templateUri: "ui://widget/availability-template.html",
    invoking: "Checking availability...",
    invoked: "Availability loaded",
    html: html,
    description: "Check available time slots for a service",
    widgetDomain: "turno.app",
  };

  // Widget for booking details
  const bookingDetailsWidget: ContentWidget = {
    id: "get_booking_details",
    title: "Booking Details",
    templateUri: "ui://widget/booking-details-template.html",
    invoking: "Loading booking details...",
    invoked: "Booking details loaded",
    html: html,
    description: "View detailed information about a specific booking",
    widgetDomain: "turno.app",
  };

  // Register resources for each widget
  server.registerResource(
    "services-widget",
    servicesWidget.templateUri,
    {
      title: servicesWidget.title,
      description: servicesWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": servicesWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${servicesWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": servicesWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": servicesWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerResource(
    "create-booking-widget",
    createBookingWidget.templateUri,
    {
      title: createBookingWidget.title,
      description: createBookingWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": createBookingWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${createBookingWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": createBookingWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": createBookingWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerResource(
    "bookings-widget",
    bookingsWidget.templateUri,
    {
      title: bookingsWidget.title,
      description: bookingsWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": bookingsWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${bookingsWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": bookingsWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": bookingsWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerResource(
    "availability-widget",
    availabilityWidget.templateUri,
    {
      title: availabilityWidget.title,
      description: availabilityWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": availabilityWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${availabilityWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": availabilityWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": availabilityWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerResource(
    "booking-details-widget",
    bookingDetailsWidget.templateUri,
    {
      title: bookingDetailsWidget.title,
      description: bookingDetailsWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": bookingDetailsWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${bookingDetailsWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": bookingDetailsWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": bookingDetailsWidget.widgetDomain,
          },
        },
      ],
    })
  );

  // Tool: List Services
  server.registerTool(
    servicesWidget.id,
    {
      title: servicesWidget.title,
      description:
        "Get a list of all available booking services. Returns service names, descriptions, durations, and prices.",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe("Optional: Filter services by category"),
      },
      _meta: widgetMeta(servicesWidget),
    },
    async ({ category }) => {
      try {
        let services = await listServices();

        if (category) {
          services = services.filter((s) => s.category === category);
        }

        const servicesText = services
          .map(
            (s) =>
              `${s.name}: ${s.duration} mins, $${s.price}${s.description ? ` - ${s.description}` : ""}`
          )
          .join("\n");

        const structuredData = {
          type: "services_list",
          services,
          count: services.length,
        };

        console.log("[MCP] Returning services data:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Available Services (${services.length}):\n\n${servicesText}`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(servicesWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching services: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  // Tool: Create Booking
  server.registerTool(
    createBookingWidget.id,
    {
      title: createBookingWidget.title,
      description:
        "Create a new booking appointment for a service. Requires service ID, customer details, date, and time.",
      inputSchema: {
        serviceId: z.string().describe("ID of the service to book"),
        customerName: z.string().describe("Customer's full name"),
        customerEmail: z.string().email().describe("Customer's email address"),
        customerPhone: z
          .string()
          .optional()
          .describe("Customer's phone number (optional)"),
        date: z
          .string()
          .describe("Booking date in YYYY-MM-DD format (e.g., 2025-01-25)"),
        time: z.string().describe("Booking time in HH:MM format (e.g., 14:00)"),
        notes: z.string().optional().describe("Additional notes (optional)"),
      },
      _meta: widgetMeta(createBookingWidget),
    },
    async ({
      serviceId,
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      notes,
    }) => {
      try {
        const booking = await createBooking({
          serviceId,
          customerName,
          customerEmail,
          customerPhone,
          date,
          time,
          status: "confirmed",
          notes,
        });

        const structuredData = {
          type: "booking_created",
          booking,
        };

        console.log("[MCP] Booking created:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Booking confirmed!

Customer: ${customerName}
Email: ${customerEmail}
Date: ${date} at ${time}
Booking ID: ${booking.id}

A confirmation email will be sent to ${customerEmail}.`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(createBookingWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating booking: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  // Tool: List Bookings
  server.registerTool(
    bookingsWidget.id,
    {
      title: bookingsWidget.title,
      description:
        "Get a list of bookings. Can filter by date, date range, or status. Use this to view upcoming appointments, past bookings, or bookings by status.",
      inputSchema: {
        date: z
          .string()
          .optional()
          .describe("Filter by specific date (YYYY-MM-DD)"),
        startDate: z
          .string()
          .optional()
          .describe("Filter by date range start (YYYY-MM-DD)"),
        endDate: z
          .string()
          .optional()
          .describe("Filter by date range end (YYYY-MM-DD)"),
        status: z
          .enum(["pending", "confirmed", "cancelled", "completed"])
          .optional()
          .describe("Filter by booking status"),
        upcoming: z
          .boolean()
          .default(false)
          .describe("Show only upcoming bookings (next 7 days)"),
      },
      _meta: widgetMeta(bookingsWidget),
    },
    async ({ date, startDate, endDate, status, upcoming = false }) => {
      try {
        let bookings;

        if (upcoming) {
          bookings = await getUpcomingBookings();
        } else {
          bookings = await listBookings({ date, startDate, endDate, status });
        }

        const bookingsText = bookings
          .map(
            (b) =>
              `${b.date} at ${b.time} - ${b.customerName} (${b.status})${b.serviceName ? ` - ${b.serviceName}` : ""}`
          )
          .join("\n");

        const structuredData = {
          type: "bookings_list",
          bookings,
          count: bookings.length,
          filters: { date, startDate, endDate, status, upcoming },
        };

        console.log("[MCP] Returning bookings data:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Bookings (${bookings.length}):\n\n${bookingsText || "No bookings found."}`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(bookingsWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching bookings: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  // Tool: Check Availability
  server.registerTool(
    availabilityWidget.id,
    {
      title: availabilityWidget.title,
      description:
        "Check available time slots for a specific service on a given date. Returns list of available and unavailable times.",
      inputSchema: {
        serviceId: z.string().describe("ID of the service to check"),
        date: z
          .string()
          .describe("Date to check availability (YYYY-MM-DD format)"),
      },
      _meta: widgetMeta(availabilityWidget),
    },
    async ({ serviceId, date }) => {
      try {
        const slots = await getAvailableSlots(serviceId, date);
        const availableSlots = slots.filter((s) => s.available);
        const service = await getService(serviceId);

        const availableTimesText = availableSlots
          .map((s) => s.time)
          .join(", ");

        const structuredData = {
          type: "availability",
          serviceId,
          serviceName: service.name,
          date,
          slots,
          availableSlots,
          availableCount: availableSlots.length,
        };

        console.log("[MCP] Returning availability data:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Availability for ${service.name} on ${date}:

Available slots (${availableSlots.length}):
${availableTimesText || "No available slots"}`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(availabilityWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error checking availability: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  // Tool: Get Booking Details
  server.registerTool(
    bookingDetailsWidget.id,
    {
      title: bookingDetailsWidget.title,
      description:
        "Get detailed information about a specific booking by its ID. Returns all booking details including customer information, service details, and status.",
      inputSchema: {
        bookingId: z.string().describe("ID of the booking to retrieve"),
      },
      _meta: widgetMeta(bookingDetailsWidget),
    },
    async ({ bookingId }) => {
      try {
        const booking = await getBooking(bookingId);

        const structuredData = {
          type: "booking_details",
          booking,
        };

        console.log("[MCP] Returning booking details:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Booking Details:

ID: ${booking.id}
Customer: ${booking.customerName}
Email: ${booking.customerEmail}
${booking.customerPhone ? `Phone: ${booking.customerPhone}\n` : ""}Date: ${booking.date} at ${booking.time}
Status: ${booking.status}
${booking.serviceName ? `Service: ${booking.serviceName}\n` : ""}${booking.notes ? `Notes: ${booking.notes}` : ""}`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(bookingDetailsWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching booking details: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  // Tool: Cancel Booking
  server.registerTool(
    "cancel_booking",
    {
      title: "Cancel Booking",
      description:
        "Cancel an existing booking by its ID. The booking status will be updated to 'cancelled'.",
      inputSchema: {
        bookingId: z.string().describe("ID of the booking to cancel"),
        reason: z
          .string()
          .optional()
          .describe("Optional reason for cancellation"),
      },
      _meta: widgetMeta(bookingDetailsWidget),
    },
    async ({ bookingId, reason }) => {
      try {
        const booking = await cancelBooking(bookingId);

        if (reason) {
          await updateBooking(bookingId, {
            notes: `Cancelled: ${reason}`,
          });
        }

        const structuredData = {
          type: "booking_cancelled",
          booking,
        };

        console.log("[MCP] Booking cancelled:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Booking cancelled successfully.

Booking ID: ${booking.id}
Customer: ${booking.customerName}
Original date: ${booking.date} at ${booking.time}
${reason ? `Reason: ${reason}` : ""}

A cancellation email will be sent to ${booking.customerEmail}.`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(bookingDetailsWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error cancelling booking: ${error instanceof Error ? error.message : "Unknown error"}`,
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

  // Tool: Get Booking Statistics
  server.registerTool(
    "get_booking_stats",
    {
      title: "Booking Statistics",
      description:
        "Get statistics about bookings including total count and breakdown by status. Can be filtered by date range.",
      inputSchema: {
        startDate: z
          .string()
          .optional()
          .describe("Filter stats from this date (YYYY-MM-DD)"),
        endDate: z
          .string()
          .optional()
          .describe("Filter stats until this date (YYYY-MM-DD)"),
      },
      _meta: widgetMeta(bookingsWidget),
    },
    async ({ startDate, endDate }) => {
      try {
        const stats = await getBookingStats(startDate, endDate);

        const structuredData = {
          type: "booking_stats",
          stats,
          dateRange: { startDate, endDate },
        };

        console.log("[MCP] Returning booking stats:", structuredData);

        return {
          content: [
            {
              type: "text",
              text: `Booking Statistics${startDate || endDate ? ` (${startDate || "start"} to ${endDate || "now"})` : ""}:

Total bookings: ${stats.total}
Confirmed: ${stats.confirmed}
Pending: ${stats.pending}
Completed: ${stats.completed}
Cancelled: ${stats.cancelled}`,
            },
          ],
          structuredContent: structuredData,
          _meta: widgetMeta(bookingsWidget),
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching statistics: ${error instanceof Error ? error.message : "Unknown error"}`,
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
