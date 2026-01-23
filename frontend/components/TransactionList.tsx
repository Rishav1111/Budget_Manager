'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/api';
import TransactionForm from './TransactionForm';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: number, transaction: Partial<Transaction>) => void;
  onDelete: (id: number) => void;
  categories: {
    income: string[];
    expense: string[];
  };
  selectedIds?: Set<number>;
  onSelectionChange?: (id: number, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  isSelectMode?: boolean;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  categories,
  selectedIds = new Set(),
  onSelectionChange,
  onSelectAll,
  isSelectMode = false,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [swipedId, setSwipedId] = useState<number | null>(null);
  
  const allSelected = transactions.length > 0 && transactions.every((t) => selectedIds.has(t.id));
  const someSelected = transactions.some((t) => selectedIds.has(t.id));

  const formatDate = (dateString: string) => {
    // Parse date string to avoid timezone issues
    const [year, month, day] = dateString.split('T')[0].split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleEdit = (transaction: Partial<Transaction>) => {
    if (editingId) {
      onEdit(editingId, transaction);
      setEditingId(null);
    }
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">No transactions found</p>
        <p className="text-gray-400 text-sm mt-2">Add a transaction to get started!</p>
      </div>
    );
  }

  const handleItemClick = (transaction: Transaction) => {
    // Don't trigger click if swiping
    if (swipedId === transaction.id) {
      setSwipedId(null);
      return;
    }
    if (isSelectMode && onSelectionChange) {
      onSelectionChange(transaction.id, !selectedIds.has(transaction.id));
    } else {
      setEditingId(transaction.id);
    }
  };

  const TransactionItem = ({ transaction, index }: { transaction: Transaction; index: number }) => {
    const isSwiped = swipedId === transaction.id;
    const showDelete = showDeleteConfirm === transaction.id;

    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
      onSwipeLeft: () => {
        if (!isSelectMode) {
          setSwipedId(transaction.id);
        }
      },
      onSwipeRight: () => {
        if (!isSelectMode && editingId !== transaction.id) {
          setEditingId(transaction.id);
          setSwipedId(null);
        }
      },
      threshold: 50,
      preventDefault: false,
    });

    return (
      <div className="relative overflow-hidden">
        {editingId === transaction.id ? (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 md:p-6 rounded-2xl border-2 border-indigo-400 shadow-xl">
            <TransactionForm
              categories={categories}
              onSubmit={handleEdit}
              initialData={transaction}
              onSuccess={() => {
                setEditingId(null);
                setSwipedId(null);
              }}
            />
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setSwipedId(null);
                }}
                className="flex-1 min-h-[44px] bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDelete) {
                    handleDelete(transaction.id);
                  } else {
                    setShowDeleteConfirm(transaction.id);
                  }
                }}
                className={`min-h-[44px] px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
                  showDelete
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
                }`}
              >
                {showDelete ? 'Confirm Delete' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl transition-all duration-300 ${
              isSelectMode ? 'cursor-default' : 'cursor-pointer'
            } ${
              selectedIds.has(transaction.id)
                ? 'ring-2 ring-indigo-500 ring-offset-2'
                : ''
            } ${
              transaction.type === 'income'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 dark:border-green-400 shadow-md hover:shadow-lg'
                : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-l-4 border-red-500 dark:border-red-400 shadow-md hover:shadow-lg'
            } ${
              isSwiped ? 'translate-x-[-100px] md:translate-x-0' : ''
            }`}
            onClick={() => handleItemClick(transaction)}
          >
            {/* Mobile swipe actions overlay */}
            <div className={`absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 bg-red-500 rounded-r-xl transition-transform duration-300 md:hidden ${
              isSwiped ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(transaction.id);
                  setSwipedId(null);
                }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-blue-500 text-white rounded-lg"
                aria-label="Edit"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (showDelete) {
                    handleDelete(transaction.id);
                  } else {
                    setShowDeleteConfirm(transaction.id);
                  }
                  setSwipedId(null);
                }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-600 text-white rounded-lg"
                aria-label="Delete"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {isSelectMode && onSelectionChange && (
              <input
                type="checkbox"
                checked={selectedIds.has(transaction.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectionChange(transaction.id, e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-5 h-5 min-w-[20px] min-h-[20px] text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
              />
            )}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg shadow-sm flex-shrink-0 ${
              transaction.type === 'income'
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                : 'bg-gradient-to-br from-red-400 to-rose-500 text-white'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-base sm:text-lg truncate">
                {transaction.description}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex flex-wrap gap-2 sm:gap-4 items-center">
                <span className="px-2 sm:px-3 py-1 bg-white/60 dark:bg-gray-700/60 rounded-full font-medium">
                  {transaction.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</span>
              </div>
            </div>
            <div
              className={`text-xl sm:text-2xl font-bold text-left px-3 sm:px-4 py-2 rounded-xl whitespace-nowrap ${
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/30' 
                  : 'text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}Rs.
              {Number(transaction.amount).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    );
  };

    return (
    <div className="space-y-3">
      {isSelectMode && transactions.length > 0 && onSelectAll && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-2">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected && !allSelected;
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select all ({selectedIds.size} selected)
          </span>
        </div>
      )}
      {transactions.map((transaction, index) => (
        <TransactionItem key={transaction.id} transaction={transaction} index={index} />
      ))}
    </div>
  );
}

