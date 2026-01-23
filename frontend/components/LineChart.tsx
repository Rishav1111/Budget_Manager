'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Transaction } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  transactions: Transaction[];
  type?: 'income' | 'expense' | 'both';
  dateRange?: { start: string; end: string };
}

export default function LineChart({ transactions, type = 'both', dateRange }: LineChartProps) {
  // Filter transactions by date range if provided
  let filteredTransactions = transactions;
  if (dateRange) {
    filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return date >= start && date <= end;
    });
  }

  // Group transactions by date
  const dateMap: Record<string, { income: number; expense: number }> = {};
  
  filteredTransactions.forEach((t) => {
    const date = t.date.split('T')[0]; // Get YYYY-MM-DD format
    if (!dateMap[date]) {
      dateMap[date] = { income: 0, expense: 0 };
    }
    const amount = Number(t.amount) || 0;
    if (t.type === 'income') {
      dateMap[date].income += amount;
    } else {
      dateMap[date].expense += amount;
    }
  });

  // Sort dates
  const sortedDates = Object.keys(dateMap).sort();

  const incomeData = sortedDates.map((date) => dateMap[date].income);
  const expenseData = sortedDates.map((date) => dateMap[date].expense);

  const datasets = [];
  
  if (type === 'income' || type === 'both') {
    datasets.push({
      label: 'Income',
      data: incomeData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: false,
    });
  }
  
  if (type === 'expense' || type === 'both') {
    datasets.push({
      label: 'Expense',
      data: expenseData,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: false,
    });
  }

  const chartData = {
    labels: sortedDates.map((date) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = Number(context.parsed.y);
            return `${label}: Rs.${value.toFixed(2)}`;
          },
        },
      },
      title: {
        display: true,
        text: type === 'both' ? 'Income & Expense Trends' : type === 'income' ? 'Income Trend' : 'Expense Trend',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rs.${Number(value).toFixed(0)}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}
