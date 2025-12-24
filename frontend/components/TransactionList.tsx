'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/api';
import TransactionForm from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: number, transaction: Partial<Transaction>) => void;
  onDelete: (id: number) => void;
  categories: {
    income: string[];
    expense: string[];
  };
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  categories,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <div className="text-center py-12 text-gray-500">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          {editingId === transaction.id ? (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-indigo-500">
              <TransactionForm
                categories={categories}
                onSubmit={handleEdit}
                initialData={transaction}
                onSuccess={() => setEditingId(null)}
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm === transaction.id) {
                      handleDelete(transaction.id);
                    } else {
                      setShowDeleteConfirm(transaction.id);
                    }
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  {showDeleteConfirm === transaction.id ? 'Confirm Delete' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`flex justify-between items-center p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                transaction.type === 'income'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
              onClick={() => setEditingId(transaction.id)}
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">
                  {transaction.description}
                </div>
                <div className="text-sm text-gray-600 flex gap-4">
                  <span>{transaction.category}</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
              <div
                className={`text-xl font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}$
                {Number(transaction.amount).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

