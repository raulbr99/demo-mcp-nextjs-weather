"use client";

export function LoadingSpinner({ message = "Loading weather data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      {/* Weather icon with spinning effect */}
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full opacity-30"></div>

        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>

        {/* Cloud icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
        </div>
      </div>

      {/* Loading text with pulse animation */}
      <p className="text-base font-medium text-slate-700 dark:text-slate-300 animate-pulse">
        {message}
      </p>

      {/* Loading dots */}
      <div className="flex gap-1.5 mt-3">
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}

