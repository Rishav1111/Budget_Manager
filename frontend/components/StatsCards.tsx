import { Stats } from '@/lib/api';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* Total Income Card */}
      <div className="group relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl shadow-xl p-4 md:p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="text-white/90 text-xs md:text-sm font-medium uppercase tracking-wide">Total Income</div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl md:text-2xl">📈</span>
            </div>
          </div>
          <div className="text-2xl md:text-4xl font-bold text-white mb-2 break-words">
            Rs.{stats.totalIncome.toFixed(2)}
          </div>
          <div className="text-white/70 text-xs flex items-center gap-1">
            {stats.incomeChange !== undefined && stats.incomeChange !== 0 && (
              <>
                <span className={stats.incomeChange > 0 ? 'text-green-200' : 'text-red-200'}>
                  {stats.incomeChange > 0 ? '↑' : '↓'}
                </span>
                <span className={stats.incomeChange > 0 ? 'text-green-200' : 'text-red-200'}>
                  {Math.abs(stats.incomeChange).toFixed(1)}% vs last month
                </span>
              </>
            )}
            {(!stats.incomeChange || stats.incomeChange === 0) && (
              <>
                <span>↑</span>
                <span>All time income</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="group relative bg-gradient-to-br from-red-400 via-rose-500 to-pink-600 rounded-2xl shadow-xl p-4 md:p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="text-white/90 text-xs md:text-sm font-medium uppercase tracking-wide">Total Expenses</div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl md:text-2xl">📉</span>
            </div>
          </div>
          <div className="text-2xl md:text-4xl font-bold text-white mb-2 break-words">
            Rs.{stats.totalExpense.toFixed(2)}
          </div>
          <div className="text-white/70 text-xs flex items-center gap-1">
            {stats.expenseChange !== undefined && stats.expenseChange !== 0 && (
              <>
                <span className={stats.expenseChange < 0 ? 'text-green-200' : 'text-red-200'}>
                  {stats.expenseChange < 0 ? '↓' : '↑'}
                </span>
                <span className={stats.expenseChange < 0 ? 'text-green-200' : 'text-red-200'}>
                  {Math.abs(stats.expenseChange).toFixed(1)}% vs last month
                </span>
              </>
            )}
            {(!stats.expenseChange || stats.expenseChange === 0) && (
              <>
                <span>↓</span>
                <span>All time expenses</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className={`group relative rounded-2xl shadow-xl p-4 md:p-6 transform hover:scale-105 transition-all duration-300 overflow-hidden ${
        stats.balance >= 0 
          ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600' 
          : 'bg-gradient-to-br from-orange-400 via-red-500 to-rose-600'
      }`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="text-white/90 text-xs md:text-sm font-medium uppercase tracking-wide">Balance</div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl md:text-2xl">{stats.balance >= 0 ? '💰' : '⚠️'}</span>
            </div>
          </div>
          <div className="text-2xl md:text-4xl font-bold text-white mb-2 break-words">
            Rs.{stats.balance.toFixed(2)}
          </div>
          <div className="text-white/70 text-xs flex items-center gap-1">
            <span>{stats.balance >= 0 ? '✓' : '✗'}</span>
            <span>{stats.balance >= 0 ? 'Positive balance' : 'Negative balance'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

