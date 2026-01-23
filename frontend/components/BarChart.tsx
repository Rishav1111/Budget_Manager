'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Transaction } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  transactions: Transaction[];
  groupBy?: 'month' | 'category';
  dateRange?: { start: string; end: string };
}

export default function BarChart({ transactions, groupBy = 'month', dateRange }: BarChartProps) {
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

  let chartData: { labels: string[]; income: number[]; expense: number[] };

  if (groupBy === 'month') {
    // Group by month
    const monthMap: Record<string, { income: number; expense: number }> = {};
    
    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { income: 0, expense: 0 };
      }
      
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        monthMap[monthKey].income += amount;
      } else {
        monthMap[monthKey].expense += amount;
      }
    });

    const sortedMonths = Object.keys(monthMap).sort();
    chartData = {
      labels: sortedMonths.map((key) => {
        const [year, month] = key.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      income: sortedMonths.map((key) => monthMap[key].income),
      expense: sortedMonths.map((key) => monthMap[key].expense),
    };
  } else {
    // Group by category
    const categoryMap: Record<string, { income: number; expense: number }> = {};
    
    filteredTransactions.forEach((t) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { income: 0, expense: 0 };
      }
      
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        categoryMap[t.category].income += amount;
      } else {
        categoryMap[t.category].expense += amount;
      }
    });

    const sortedCategories = Object.keys(categoryMap).sort((a, b) => {
      const totalA = categoryMap[a].income + categoryMap[a].expense;
      const totalB = categoryMap[b].income + categoryMap[b].expense;
      return totalB - totalA;
    });

    chartData = {
      labels: sortedCategories,
      income: sortedCategories.map((cat) => categoryMap[cat].income),
      expense: sortedCategories.map((cat) => categoryMap[cat].expense),
    };
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Income',
        data: chartData.income,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: chartData.expense,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
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
        text: groupBy === 'month' ? 'Monthly Comparison' : 'Category Comparison',
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

  if (chartData.labels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
}
