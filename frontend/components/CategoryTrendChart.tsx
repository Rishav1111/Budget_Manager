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

interface CategoryTrendChartProps {
  transactions: Transaction[];
  category?: string;
  dateRange?: { start: string; end: string };
}

export default function CategoryTrendChart({ transactions, category, dateRange }: CategoryTrendChartProps) {
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

  // Filter by category if specified, otherwise show all expense categories
  if (category && category !== 'all') {
    filteredTransactions = filteredTransactions.filter((t) => t.category === category);
  } else {
    filteredTransactions = filteredTransactions.filter((t) => t.type === 'expense');
  }

  // Group by month and category
  const monthCategoryMap: Record<string, Record<string, number>> = {};
  
  filteredTransactions.forEach((t) => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthCategoryMap[monthKey]) {
      monthCategoryMap[monthKey] = {};
    }
    
    const amount = Number(t.amount) || 0;
    monthCategoryMap[monthKey][t.category] = (monthCategoryMap[monthKey][t.category] || 0) + amount;
  });

  // Get all unique categories
  const allCategories = new Set<string>();
  Object.values(monthCategoryMap).forEach((categories) => {
    Object.keys(categories).forEach((cat) => allCategories.add(cat));
  });

  // Sort months
  const sortedMonths = Object.keys(monthCategoryMap).sort();
  
  // Limit to top 5 categories by total spending
  const categoryTotals: Record<string, number> = {};
  Object.values(monthCategoryMap).forEach((categories) => {
    Object.entries(categories).forEach(([cat, amount]) => {
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
    });
  });

  const topCategories = Array.from(allCategories)
    .sort((a, b) => (categoryTotals[b] || 0) - (categoryTotals[a] || 0))
    .slice(0, 5);

  const colors = [
    'rgb(239, 68, 68)',
    'rgb(245, 158, 11)',
    'rgb(34, 197, 94)',
    'rgb(59, 130, 246)',
    'rgb(139, 92, 246)',
  ];

  const datasets = topCategories.map((cat, index) => ({
    label: cat,
    data: sortedMonths.map((monthKey) => monthCategoryMap[monthKey][cat] || 0),
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
    tension: 0.4,
    fill: false,
  }));

  const chartData = {
    labels: sortedMonths.map((key) => {
      const [year, month] = key.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
        text: category && category !== 'all' 
          ? `${category} Spending Trend` 
          : 'Category Spending Trends',
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

  if (sortedMonths.length === 0 || topCategories.length === 0) {
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
