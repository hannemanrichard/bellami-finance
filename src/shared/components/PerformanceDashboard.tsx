"use client";

import { useState, useEffect } from "react";
import { performanceTracker } from "@/shared/utils/performanceTracker";
import logger from "@/shared/utils/logger";

/**
 * Simple Performance Dashboard Component
 *
 * This component shows performance metrics in development mode.
 * It helps track the impact of our optimizations.
 */
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(performanceTracker.getMetrics());
  const [summary, setSummary] = useState(performanceTracker.getSummary());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const interval = setInterval(() => {
      setMetrics(performanceTracker.getMetrics());
      setSummary(performanceTracker.getSummary());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== "development") {
    logger.debug("PerformanceDashboard: Not in development mode, hiding");
    return null;
  }

  logger.debug("PerformanceDashboard: Rendering in development mode");

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-lg"
        title="Performance Dashboard"
        style={{ zIndex: 9999 }}
      >
        🚀
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
            <button
              onClick={() => performanceTracker.clear()}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>

          {/* Summary */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-medium text-sm mb-2">Summary</h4>
            <div className="text-xs space-y-1">
              <div>Total Metrics: {summary.totalMetrics}</div>
              <div>
                Average Duration: {summary.averageDuration.toFixed(2)}ms
              </div>
              {summary.slowestMetric && (
                <div>
                  Slowest: {summary.slowestMetric.name} (
                  {summary.slowestMetric.duration?.toFixed(2)}ms)
                </div>
              )}
              {summary.fastestMetric && (
                <div>
                  Fastest: {summary.fastestMetric.name} (
                  {summary.fastestMetric.duration?.toFixed(2)}ms)
                </div>
              )}
            </div>
          </div>

          {/* Metrics List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recent Metrics</h4>
            {metrics.length === 0 ? (
              <p className="text-xs text-gray-500">No metrics yet</p>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {metrics
                  .slice(-10)
                  .reverse()
                  .map((metric, index) => (
                    <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="font-medium">{metric.name}</div>
                      {metric.duration && (
                        <div className="text-gray-600">
                          {metric.duration.toFixed(2)}ms
                        </div>
                      )}
                      {metric.metadata &&
                        Object.keys(metric.metadata).length > 0 && (
                          <div className="text-gray-500 mt-1">
                            {JSON.stringify(metric.metadata)}
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
