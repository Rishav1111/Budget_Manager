'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/api';

interface TransactionFormProps {
  categories: {
    income: string[];
    expense: string[];
  };
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void | Promise<void>;
  initialData?: Transaction;
  onSuccess?: () => void;
  onLoadTemplate?: (transaction: Omit<Transaction, 'id'>) => void;
  onSaveTemplate?: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({
  categories,
  onSubmit,
  initialData,
  onSuccess,
  onLoadTemplate,
  onSaveTemplate,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setDescription(initialData.description);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
    } else {
      // Use a consistent date format to avoid hydration issues
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  }, [initialData]);

  // Load template data when provided
  useEffect(() => {
    if (onLoadTemplate) {
      // This will be called from parent when template is selected
    }
  }, [onLoadTemplate]);

  // Expose method to load template via ref callback
  const loadTemplate = (template: Omit<Transaction, 'id'>) => {
    setType(template.type);
    setDescription(template.description);
    setAmount(template.amount.toString());
    setCategory(template.category);
    // Keep current date when loading template
  };

  useEffect(() => {
    if (onLoadTemplate) {
      (window as any).loadTransactionTemplate = loadTemplate;
    }
    return () => {
      delete (window as any).loadTransactionTemplate;
    };
  }, [onLoadTemplate]);

  useEffect(() => {
    setCategory('');
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      type,
      description,
      amount: parseFloat(amount),
      category,
      date,
    });
    if (!initialData) {
      setDescription('');
      setAmount('');
      setCategory('');
      // Use a consistent date format to avoid hydration issues
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Salary, Groceries"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select category</option>
          {categories[type].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          className="flex-1 min-h-[44px] bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
        >
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </button>
        {onSaveTemplate && !initialData && (
          <button
            type="button"
            onClick={() => {
              if (description && amount && category) {
                onSaveTemplate({
                  type,
                  description,
                  amount: parseFloat(amount),
                  category,
                  date,
                });
              } else {
                alert('Please fill in all fields before saving as template');
              }
            }}
            className="min-h-[44px] min-w-[44px] px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-semibold text-sm flex items-center justify-center"
            title="Save as template"
          >
            💾
          </button>
        )}
      </div>
    </form>
  );
}

