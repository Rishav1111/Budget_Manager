'use client';

import { useEffect, useState } from 'react';
import { insightsApi, Insight } from '@/lib/api';

interface InsightsPanelProps {
  className?: string;
}

export default function InsightsPanel({ className = '' }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await insightsApi.getInsights();
      setInsights(data || []);
    } catch (err) {
      console.error('Error loading insights:', err);
      setError('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'recommendation':
        return '💡';
      case 'info':
        return 'ℹ️';
      default:
        return '📊';
    }
  };

  const getInsightColorClasses = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'recommendation':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800';
      case 'info':
        return 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700';
    }
  };

  const getTitleColorClasses = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'text-amber-700 dark:text-amber-400';
      case 'success':
        return 'text-green-700 dark:text-green-400';
      case 'recommendation':
        return 'text-blue-700 dark:text-blue-400';
      case 'info':
        return 'text-indigo-700 dark:text-indigo-400';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className={`${className} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50`}>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-lg md:text-xl">💡</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Financial Insights
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50`}>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-lg md:text-xl">💡</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Financial Insights
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadInsights}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50 transform hover:shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-lg md:text-xl">💡</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Financial Insights
          </h2>
        </div>
        <button
          onClick={loadInsights}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Refresh insights"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No insights available yet. Add more transactions to get personalized financial insights!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 ${getInsightColorClasses(
                insight.type,
              )} transform hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-sm md:text-base mb-1 ${getTitleColorClasses(
                      insight.type,
                    )}`}
                  >
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {insight.message}
                  </p>
                  {insight.action && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        💼 {insight.action}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
