"use client";

import { useState } from "react";

interface DebugPanelProps {
  isChatGptApp: boolean;
  toolOutput: any;
  weatherData: any;
  displayMode: any;
}

export function DebugPanel({
  isChatGptApp,
  toolOutput,
  weatherData,
  displayMode,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in ChatGPT environment
  if (!isChatGptApp) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
      >
        {isOpen ? "Hide Debug" : "Show Debug"}
      </button>

      {isOpen && (
        <div className="mt-2 bg-slate-900 text-white p-4 rounded-lg shadow-2xl max-w-md max-h-96 overflow-auto text-xs font-mono">
          <h3 className="text-sm font-bold mb-3 text-purple-400">
            Debug Info
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-purple-300 font-semibold">Environment:</p>
              <p className="text-green-400">
                isChatGptApp: {String(isChatGptApp)}
              </p>
              <p className="text-green-400">
                displayMode: {String(displayMode)}
              </p>
              <p className="text-green-400">
                window.openai exists:{" "}
                {String(typeof window !== "undefined" && !!window.openai)}
              </p>
            </div>

            <div>
              <p className="text-purple-300 font-semibold">Tool Output:</p>
              <pre className="text-yellow-300 whitespace-pre-wrap break-all">
                {JSON.stringify(toolOutput, null, 2)}
              </pre>
            </div>

            <div>
              <p className="text-purple-300 font-semibold">Weather Data:</p>
              <pre className="text-blue-300 whitespace-pre-wrap break-all">
                {JSON.stringify(weatherData, null, 2)}
              </pre>
            </div>

            <div>
              <p className="text-purple-300 font-semibold">
                window.openai keys:
              </p>
              <pre className="text-gray-300 whitespace-pre-wrap">
                {typeof window !== "undefined" && window.openai
                  ? Object.keys(window.openai).join(", ")
                  : "N/A"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
