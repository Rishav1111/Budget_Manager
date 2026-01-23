'use client';

import { Transaction } from '@/lib/api';

interface QuickActionButtonsProps {
  onQuickAdd: (transaction: Omit<Transaction, 'id'>) => void;
  recentTransactions?: Transaction[];
}

const commonTransactions = [
  { type: 'expense' as const, description: 'Coffee', amount: 50, category: 'Food' },
  { type: 'expense' as const, description: 'Lunch', amount: 200, category: 'Food' },
  { type: 'expense' as const, description: 'Uber/Taxi', amount: 150, category: 'Transport' },
  { type: 'expense' as const, description: 'Groceries', amount: 500, category: 'Food' },
  { type: 'income' as const, description: 'Salary', amount: 50000, category: 'Salary' },
  { type: 'income' as const, description: 'Freelance', amount: 5000, category: 'Freelance' },
];

export default function QuickActionButtons({
  onQuickAdd,
  recentTransactions = [],
}: QuickActionButtonsProps) {
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleQuickAdd = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    onQuickAdd({
      ...transaction,
      date: getTodayDate(),
    });
  };

  // Get unique recent transactions (last 5)
  const uniqueRecent = recentTransactions
    .slice(0, 5)
    .filter((t, index, self) => 
      index === self.findIndex((tr) => 
        tr.description === t.description && 
        tr.category === t.category &&
        tr.type === t.type
      )
    );

  return (
    <div className="space-y-4">
      {/* Common Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Quick Add
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonTransactions.map((transaction, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd(transaction)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                transaction.type === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
              }`}
            >
              {transaction.description} (Rs. {transaction.amount})
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions Quick Add */}
      {uniqueRecent.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recent Transactions
          </h3>
          <div className="flex flex-wrap gap-2">
            {uniqueRecent.map((transaction) => (
              <button
                key={transaction.id}
                onClick={() => handleQuickAdd({
                  type: transaction.type,
                  description: transaction.description,
                  amount: transaction.amount,
                  category: transaction.category,
                })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md border-2 ${
                  transaction.type === 'income'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                {transaction.description} (Rs. {transaction.amount})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
