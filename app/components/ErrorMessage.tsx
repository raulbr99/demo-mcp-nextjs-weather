"use client";

export interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({
  title = "Error",
  message,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-md">
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
        </div>
      </div>
    </div>
  );
}

