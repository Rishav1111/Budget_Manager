import { Stats } from '@/lib/api';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="text-sm text-gray-600 mb-1">Total Income</div>
        <div className="text-3xl font-bold text-gray-900">
          ${stats.totalIncome.toFixed(2)}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
        <div className="text-3xl font-bold text-gray-900">
          ${stats.totalExpense.toFixed(2)}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
        <div className="text-sm text-gray-600 mb-1">Balance</div>
        <div
          className={`text-3xl font-bold ${
            stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          ${stats.balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

