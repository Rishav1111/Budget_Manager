'use client';

import { useState } from 'react';
import { Budget } from '@/lib/api';

interface BudgetSectionProps {
  budgets: Budget[];
  categories: string[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
}

export default function BudgetSection({
  budgets,
  categories,
  onAddBudget,
}: BudgetSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBudget({
      category,
      limit: parseFloat(limit),
    });
    setCategory('');
    setLimit('');
    setShowForm(false);
  };

  return (
    <div>
      {budgets.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No budget limits set</p>
      ) : (
        <div className="space-y-3 mb-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{budget.category}</div>
                <div className="font-semibold">{Number(budget.percentage || 0).toFixed(0)}%</div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                ${budget.spent?.toFixed(2) || '0.00'} / ${Number(budget.limit).toFixed(2)}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    (budget.percentage || 0) >= 100
                      ? 'bg-red-500'
                      : (budget.percentage || 0) >= 80
                      ? 'bg-yellow-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(Number(budget.percentage) || 0, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Limit
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Set Budget
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setCategory('');
                setLimit('');
              }}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-semibold"
        >
          Add Budget Limit
        </button>
      )}
    </div>
  );
}

