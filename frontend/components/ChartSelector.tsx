'use client';

import { useState } from 'react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import IncomeExpenseChart from './IncomeExpenseChart';
import CategoryTrendChart from './CategoryTrendChart';
import ExpenseChart from './ExpenseChart';
import BudgetVsActualChart from './BudgetVsActualChart';
import DateRangePicker from './DateRangePicker';
import { Transaction, Budget } from '@/lib/api';

type ChartType = 'doughnut' | 'line' | 'bar' | 'income-expense' | 'category-trend' | 'budget-vs-actual';

interface ChartSelectorProps {
  transactions: Transaction[];
  categories: { income: string[]; expense: string[] };
  budgets?: Budget[];
}

export default function ChartSelector({ transactions, categories, budgets = [] }: ChartSelectorProps) {
  const [chartType, setChartType] = useState<ChartType>('doughnut');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 2); // Default to last 3 months
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  });

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
  };

  const renderChart = () => {
    switch (chartType) {
      case 'doughnut':
        return <ExpenseChart transactions={transactions} />;
      case 'line':
        return <LineChart transactions={transactions} type="both" dateRange={dateRange} />;
      case 'bar':
        return <BarChart transactions={transactions} groupBy="month" dateRange={dateRange} />;
      case 'income-expense':
        return <IncomeExpenseChart transactions={transactions} dateRange={dateRange} />;
      case 'category-trend':
        return <CategoryTrendChart transactions={transactions} dateRange={dateRange} />;
      case 'budget-vs-actual':
        return <BudgetVsActualChart budgets={budgets} transactions={transactions} />;
      default:
        return <ExpenseChart transactions={transactions} />;
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setChartType('doughnut')}
            className={`min-h-[44px] px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              chartType === 'doughnut'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
          >
            <span className="hidden sm:inline">Doughnut</span>
            <span className="sm:hidden">Donut</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`min-h-[44px] px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              chartType === 'line'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
          >
            <span className="hidden sm:inline">Line Chart</span>
            <span className="sm:hidden">Line</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`min-h-[44px] px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              chartType === 'bar'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
          >
            <span className="hidden sm:inline">Bar Chart</span>
            <span className="sm:hidden">Bar</span>
          </button>
          <button
            onClick={() => setChartType('income-expense')}
            className={`min-h-[44px] px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              chartType === 'income-expense'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
          >
            <span className="hidden md:inline">Income vs Expense</span>
            <span className="hidden sm:inline md:hidden">I vs E</span>
            <span className="sm:hidden">I/E</span>
          </button>
          <button
            onClick={() => setChartType('category-trend')}
            className={`min-h-[44px] px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              chartType === 'category-trend'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
          >
            <span className="hidden sm:inline">Category Trends</span>
            <span className="sm:hidden">Trends</span>
          </button>
          <button
            onClick={() => setChartType('budget-vs-actual')}
            className={`min-h-[44px] px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              chartType === 'budget-vs-actual'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
            }`}
          >
            <span className="hidden sm:inline">Budget vs Actual</span>
            <span className="sm:hidden">Budget</span>
          </button>
        </div>
      </div>

      {chartType !== 'doughnut' && chartType !== 'budget-vs-actual' && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={handleDateRangeChange}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 md:p-4 border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="min-w-[280px]">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
