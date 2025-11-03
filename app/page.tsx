"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  useWidgetProps,
  useMaxHeight,
  useDisplayMode,
  useRequestDisplayMode,
  useIsChatGptApp,
} from "./hooks";
import { ServiceCard } from "./components/ServiceCard";
import { BookingCard } from "./components/BookingCard";
import { AvailabilityDisplay } from "./components/AvailabilityDisplay";
import { BookingStats } from "./components/BookingStats";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";

interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  color?: string;
  isActive?: boolean;
}

interface Booking {
  id: string;
  serviceId: string;
  serviceName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

interface BookingResult {
  type?:
    | "services_list"
    | "booking_created"
    | "bookings_list"
    | "availability"
    | "booking_details"
    | "booking_cancelled"
    | "booking_stats"
    | "error";

  // Services list
  services?: Service[];
  count?: number;

  // Single booking
  booking?: Booking;

  // Bookings list
  bookings?: Booking[];
  filters?: any;

  // Availability
  serviceId?: string;
  serviceName?: string;
  date?: string;
  slots?: AvailableSlot[];
  availableSlots?: AvailableSlot[];
  availableCount?: number;

  // Statistics
  stats?: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
  };
  dateRange?: {
    startDate?: string;
    endDate?: string;
  };

  // Error
  error?: string;
}

export default function Home() {
  const toolOutput = useWidgetProps<Record<string, unknown>>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();

  const [isLoading, setIsLoading] = useState(false);
  const bookingData = toolOutput as BookingResult | null;

  useEffect(() => {
    if (isChatGptApp) {
      if (!bookingData) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [isChatGptApp, bookingData]);

  // Debug logging
  if (typeof window !== "undefined") {
    console.log("=== TURNO DEBUG INFO ===");
    console.log("isChatGptApp:", isChatGptApp);
    console.log("toolOutput:", toolOutput);
    console.log("bookingData:", bookingData);
    console.log("displayMode:", displayMode);
    console.log("========================");
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingSpinner />
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Loading booking data...
          </p>
        </div>
      );
    }

    if (!bookingData) {
      return (
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Turno Booking System
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            Manage your appointments and bookings effortlessly through ChatGPT!
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 max-w-md">
            <li>• "Show me available services"</li>
            <li>• "Create a booking for [service] on [date] at [time]"</li>
            <li>• "Show my bookings for today"</li>
            <li>• "Check availability for [service] on [date]"</li>
            <li>• "Show me booking statistics"</li>
          </ul>
        </div>
      );
    }

    if (bookingData.type === "error") {
      return (
        <ErrorMessage
          title="Booking Error"
          message={bookingData.error || "An unknown error occurred"}
        />
      );
    }

    if (bookingData.type === "services_list" && bookingData.services) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Available Services
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {bookingData.count} service{bookingData.count !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookingData.services.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={service.description}
                duration={service.duration}
                price={service.price}
                category={service.category}
                color={service.color}
                isActive={service.isActive}
              />
            ))}
          </div>
        </div>
      );
    }

    if (bookingData.type === "booking_created" && bookingData.booking) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <svg
                className="w-16 h-16 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Your appointment has been successfully created
            </p>
          </div>
          <BookingCard {...bookingData.booking} />
        </div>
      );
    }

    if (bookingData.type === "bookings_list" && bookingData.bookings) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your Bookings
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {bookingData.count} booking{bookingData.count !== 1 ? 's' : ''} found
            </p>
          </div>
          {bookingData.bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookingData.bookings.map((booking) => (
                <BookingCard key={booking.id} {...booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Bookings Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                You don't have any bookings matching the selected criteria.
              </p>
            </div>
          )}
        </div>
      );
    }

    if (bookingData.type === "availability" && bookingData.slots) {
      return (
        <AvailabilityDisplay
          serviceName={bookingData.serviceName || "Service"}
          date={bookingData.date || ""}
          slots={bookingData.slots}
          availableCount={bookingData.availableCount || 0}
        />
      );
    }

    if (bookingData.type === "booking_details" && bookingData.booking) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Booking Details
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <BookingCard {...bookingData.booking} />
          </div>
        </div>
      );
    }

    if (bookingData.type === "booking_cancelled" && bookingData.booking) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block p-4 bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <svg
                className="w-16 h-16 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Booking Cancelled
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              The appointment has been cancelled successfully
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <BookingCard {...bookingData.booking} />
          </div>
        </div>
      );
    }

    if (bookingData.type === "booking_stats" && bookingData.stats) {
      return (
        <BookingStats
          total={bookingData.stats.total}
          confirmed={bookingData.stats.confirmed}
          pending={bookingData.stats.pending}
          cancelled={bookingData.stats.cancelled}
          completed={bookingData.stats.completed}
          dateRange={bookingData.dateRange}
        />
      );
    }

    return <LoadingSpinner />;
  };

  return (
    <div
      className="font-sans min-h-screen p-4 sm:p-8"
      style={{
        maxHeight,
        height: displayMode === "fullscreen" ? maxHeight : undefined,
        overflow: "auto",
      }}
    >
      {displayMode !== "fullscreen" && (
        <button
          aria-label="Enter fullscreen"
          className="fixed top-4 right-4 z-50 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => requestDisplayMode("fullscreen")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      )}

      <main className="max-w-6xl mx-auto">
        {!isChatGptApp && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                  This booking system is designed to work with ChatGPT.
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Connect it to ChatGPT to manage bookings through natural conversation.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Turno
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Smart Booking Management
            </p>
          </div>
        </div>

        <div className="space-y-6">{renderContent()}</div>

        {!bookingData && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-full">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Powered by Turno Booking API
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
