"use client";

export function LoadingSpinner({ message = "Loading weather data..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

