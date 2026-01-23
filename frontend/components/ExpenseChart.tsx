'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Transaction } from '@/lib/api';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
  transactions: Transaction[];
}

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const amount = Number(t.amount) || 0;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#10b981',
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4',
          '#84cc16',
        ],
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = Number(context.parsed);
            return `${label}: Rs.${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No expenses for the selected transactions</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut
        data={chartData}
        options={options}
      />
    </div>
  );
}

