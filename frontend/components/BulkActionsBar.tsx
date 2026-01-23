'use client';

import { useState } from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkUpdate: (field: 'category' | 'type' | 'date', value: string) => void;
  onClearSelection: () => void;
  categories: {
    income: string[];
    expense: string[];
  };
}

export default function BulkActionsBar({
  selectedCount,
  onBulkDelete,
  onBulkUpdate,
  onClearSelection,
  categories,
}: BulkActionsBarProps) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [dateValue, setDateValue] = useState('');

  if (selectedCount === 0) return null;

  const handleDateSubmit = () => {
    if (dateValue) {
      onBulkUpdate('date', dateValue);
      setDateValue('');
      setShowDateInput(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl shadow-lg mb-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 font-semibold">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{selectedCount} selected</span>
      </div>

      <div className="flex-1"></div>

      <div className="flex flex-wrap gap-2">
        {/* Bulk Category Update */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowTypeMenu(false);
              setShowDateInput(false);
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Change Category
          </button>
          {showCategoryMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 min-w-[200px] border border-gray-200 dark:border-gray-700">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">Income</div>
                {categories.income.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onBulkUpdate('category', cat);
                      setShowCategoryMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    {cat}
                  </button>
                ))}
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 mt-2 mb-1">Expense</div>
                {categories.expense.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onBulkUpdate('category', cat);
                      setShowCategoryMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bulk Type Update */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypeMenu(!showTypeMenu);
              setShowCategoryMenu(false);
              setShowDateInput(false);
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Change Type
          </button>
          {showTypeMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 min-w-[150px] border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  onBulkUpdate('type', 'income');
                  setShowTypeMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-t-lg transition-colors"
              >
                Income
              </button>
              <button
                onClick={() => {
                  onBulkUpdate('type', 'expense');
                  setShowTypeMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
              >
                Expense
              </button>
            </div>
          )}
        </div>

        {/* Bulk Date Update */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateInput(!showDateInput);
              setShowCategoryMenu(false);
              setShowTypeMenu(false);
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Change Date
          </button>
          {showDateInput && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-3 border border-gray-200 dark:border-gray-700">
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleDateSubmit}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowDateInput(false);
                    setDateValue('');
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Delete */}
        <button
          onClick={onBulkDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>

        {/* Clear Selection */}
        <button
          onClick={onClearSelection}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
