import React from 'react';

interface BookingCardProps {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  serviceName?: string;
  notes?: string;
}

export function BookingCard({
  id,
  customerName,
  customerEmail,
  customerPhone,
  date,
  time,
  status,
  serviceName,
  notes,
}: BookingCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    confirmed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    cancelled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    completed: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  };

  const statusIcons = {
    pending: '⏳',
    confirmed: '✓',
    cancelled: '✕',
    completed: '✓',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-xl animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {customerName}
            </h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
              {statusIcons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          {serviceName && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {serviceName}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{formatDate(date)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{formatTime(time)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{customerEmail}</span>
        </div>

        {customerPhone && (
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{customerPhone}</span>
          </div>
        )}

        {notes && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
              "{notes}"
            </p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Booking ID: {id}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
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
