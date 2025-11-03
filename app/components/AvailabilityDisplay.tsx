import React from 'react';

interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

interface AvailabilityDisplayProps {
  serviceName: string;
  date: string;
  slots: AvailableSlot[];
  availableCount: number;
}

export function AvailabilityDisplay({
  serviceName,
  date,
  slots,
  availableCount,
}: AvailabilityDisplayProps) {
  const availableSlots = slots.filter(s => s.available);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {serviceName}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Availability for {formatDate(date)}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            {availableCount} available slot{availableCount !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {availableCount > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {availableSlots.map((slot, index) => (
            <div
              key={index}
              className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-3 text-center cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                {formatTime(slot.time)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                Available
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Available Slots
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            There are no available time slots for this date. Please try another date.
          </p>
        </div>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}
