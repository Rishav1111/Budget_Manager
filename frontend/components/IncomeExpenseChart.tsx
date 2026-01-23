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

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  dateRange?: { start: string; end: string };
}

export default function IncomeExpenseChart({ transactions, dateRange }: IncomeExpenseChartProps) {
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

  // Group transactions by month
  const monthMap: Record<string, { income: number; expense: number; balance: number }> = {};
  
  filteredTransactions.forEach((t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { income: 0, expense: 0, balance: 0 };
    }
    
    const amount = Number(t.amount) || 0;
    if (t.type === 'income') {
      monthMap[monthKey].income += amount;
      monthMap[monthKey].balance += amount;
    } else {
      monthMap[monthKey].expense += amount;
      monthMap[monthKey].balance -= amount;
    }
  });

  // Sort months
  const sortedMonths = Object.keys(monthMap).sort();

  const incomeData = sortedMonths.map((key) => monthMap[key].income);
  const expenseData = sortedMonths.map((key) => monthMap[key].expense);
  const balanceData = sortedMonths.map((key) => monthMap[key].balance);

  const chartData = {
    labels: sortedMonths.map((key) => {
      const [year, month] = key.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Expense',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Balance',
        data: balanceData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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
        text: 'Income vs Expense Comparison',
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rs.${Number(value).toFixed(0)}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Income & Expense',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          callback: (value) => `Rs.${Number(value).toFixed(0)}`,
        },
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Balance',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (sortedMonths.length === 0) {
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
