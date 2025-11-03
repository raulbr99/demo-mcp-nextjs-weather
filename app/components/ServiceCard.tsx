import React from 'react';

interface ServiceCardProps {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category?: string;
  color?: string;
  isActive?: boolean;
}

export function ServiceCard({
  name,
  description,
  duration,
  price,
  category,
  color = '#028FF5',
  isActive = true,
}: ServiceCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border-l-4 transition-all hover:shadow-xl animate-fade-in"
         style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {name}
          </h3>
          {category && (
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {category}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ${price}
          </div>
          {!isActive && (
            <span className="text-xs text-red-600 dark:text-red-400">
              Inactive
            </span>
          )}
        </div>
      </div>

      {description && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          {description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{duration} mins</span>
        </div>
      </div>
    </div>
  );
}
