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
import { Budget, Transaction } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BudgetVsActualChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetVsActualChart({ budgets, transactions }: BudgetVsActualChartProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No budgets set. Create budgets to see comparison.</p>
      </div>
    );
  }

  // Calculate actual spending per category
  const categorySpending: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const amount = Number(t.amount) || 0;
      categorySpending[t.category] = (categorySpending[t.category] || 0) + amount;
    });

  // Prepare data
  const labels = budgets.map((b) => b.category);
  const budgetData = budgets.map((b) => Number(b.limit) || 0);
  const actualData = budgets.map((b) => categorySpending[b.category] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Budget Limit',
        data: budgetData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Actual Spending',
        data: actualData,
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
            const category = labels[context.dataIndex];
            const budget = budgetData[context.dataIndex];
            const actual = actualData[context.dataIndex];
            const percentage = budget > 0 ? ((actual / budget) * 100).toFixed(1) : '0';
            
            if (label === 'Actual Spending') {
              return [
                `${label}: Rs.${value.toFixed(2)}`,
                `Budget: Rs.${budget.toFixed(2)}`,
                `Usage: ${percentage}%`,
                actual > budget ? '⚠️ Over budget!' : '✓ Within budget',
              ];
            }
            return `${label}: Rs.${value.toFixed(2)}`;
          },
        },
      },
      title: {
        display: true,
        text: 'Budget vs Actual Spending',
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

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
