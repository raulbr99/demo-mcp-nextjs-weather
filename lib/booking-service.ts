/**
 * Turno Booking Service Module
 * Integrates with Turno API to manage bookings, services, and appointments
 */

const BASE_URL = process.env.TURNO_API_BASE_URL || 'https://xavgmcqkeqfodloknnbr.supabase.co/functions/v1/make-server-8141ccf4';
const API_KEY = process.env.TURNO_API_KEY;

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category?: string;
  color?: string;
  isActive?: boolean;
  requirements?: string[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  duration?: number;
  price?: number;
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isActive: boolean;
}

export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

async function makeRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  if (!API_KEY) {
    throw new Error('TURNO_API_KEY is not configured in environment variables');
  }

  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Turno API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// Services Management
// ============================================================================

/**
 * Get all available services
 */
export async function listServices(): Promise<Service[]> {
  const data = await makeRequest('/api/services');
  return data.services || [];
}

/**
 * Get a specific service by ID
 */
export async function getService(serviceId: string): Promise<Service> {
  const services = await listServices();
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    throw new Error(`Service with ID "${serviceId}" not found`);
  }

  return service;
}

/**
 * Create a new service
 */
export async function createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
  const data = await makeRequest('/api/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
  return data.service;
}

// ============================================================================
// Bookings Management
// ============================================================================

/**
 * Get all bookings, optionally filtered by date or status
 */
export async function listBookings(filters?: {
  date?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<Booking[]> {
  let endpoint = '/api/bookings';

  if (filters) {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }

  const data = await makeRequest(endpoint);
  return data.bookings || [];
}

/**
 * Get a specific booking by ID
 */
export async function getBooking(bookingId: string): Promise<Booking> {
  const bookings = await listBookings();
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    throw new Error(`Booking with ID "${bookingId}" not found`);
  }

  return booking;
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
  const data = await makeRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
  return data.booking;
}

/**
 * Update an existing booking
 */
export async function updateBooking(
  bookingId: string,
  updates: Partial<Booking>
): Promise<Booking> {
  const data = await makeRequest(`/api/bookings/${bookingId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.booking;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string): Promise<Booking> {
  return updateBooking(bookingId, { status: 'cancelled' });
}

/**
 * Delete a booking
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  await makeRequest(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Availability & Scheduling
// ============================================================================

/**
 * Get available time slots for a specific service and date
 */
export async function getAvailableSlots(
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> {
  // This would typically call a specific endpoint, but we'll simulate it
  // by getting all bookings for that date and calculating availability
  const bookings = await listBookings({ date });
  const service = await getService(serviceId);

  // Generate time slots from 9 AM to 5 PM (adjust based on business hours)
  const slots: AvailableSlot[] = [];
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      // Check if this slot conflicts with existing bookings
      const isAvailable = !bookings.some(booking => {
        return booking.serviceId === serviceId && booking.time === time;
      });

      slots.push({ date, time, available: isAvailable });
    }
  }

  return slots;
}

/**
 * Get bookings for a specific date range
 */
export async function getBookingsByDateRange(
  startDate: string,
  endDate: string
): Promise<Booking[]> {
  return listBookings({ startDate, endDate });
}

/**
 * Get today's bookings
 */
export async function getTodayBookings(): Promise<Booking[]> {
  const today = new Date().toISOString().split('T')[0];
  return listBookings({ date: today });
}

/**
 * Get upcoming bookings (next 7 days)
 */
export async function getUpcomingBookings(days: number = 7): Promise<Booking[]> {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + days);

  return listBookings({
    startDate: today.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });
}

// ============================================================================
// Statistics & Analytics
// ============================================================================

/**
 * Get booking statistics
 */
export async function getBookingStats(
  startDate?: string,
  endDate?: string
): Promise<BookingStats> {
  const bookings = await listBookings({ startDate, endDate });

  return {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Combine date and time for display
 */
export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} at ${formatTime(time)}`;
}
