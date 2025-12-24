'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { transactionsApi, budgetsApi, Transaction, Budget, Stats } from '@/lib/api';
import { isAuthenticated, getUser, removeToken, removeUser } from '@/lib/auth';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import StatsCards from '@/components/StatsCards';
import BudgetSection from '@/components/BudgetSection';
import ExpenseChart from '@/components/ExpenseChart';

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'],
};

export default function Home() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [stats, setStats] = useState<Stats>({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.push('/login');
  };

  const loadData = async () => {
    try {
      const [transactionsData, budgetsData, statsData] = await Promise.all([
        transactionsApi.getAll().catch(() => []),
        budgetsApi.getWithSpending().catch(() => []),
        transactionsApi.getStats().catch(() => ({ totalIncome: 0, totalExpense: 0, balance: 0 })),
      ]);
      setTransactions(transactionsData || []);
      setBudgets(budgetsData || []);
      setStats(statsData || { totalIncome: 0, totalExpense: 0, balance: 0 });
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty defaults on error
      setTransactions([]);
      setBudgets([]);
      setStats({ totalIncome: 0, totalExpense: 0, balance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionsApi.create(transaction);
      setTransactions([newTransaction, ...transactions]);
      await refreshStats();
      await refreshBudgets();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    try {
      const updated = await transactionsApi.update(id, transaction);
      setTransactions(transactions.map((t) => (t.id === id ? updated : t)));
      await refreshStats();
      await refreshBudgets();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionsApi.delete(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      await refreshStats();
      await refreshBudgets();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleAddBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      await budgetsApi.create(budget);
      await refreshBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const refreshStats = async () => {
    try {
      const statsData = await transactionsApi.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const refreshBudgets = async () => {
    try {
      const budgetsData = await budgetsApi.getWithSpending();
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error refreshing budgets:', error);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterMonth && !t.date.startsWith(filterMonth)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900">💰 Budget Manager</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <StatsCards stats={stats} />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
              <TransactionForm
                categories={categories}
                onSubmit={handleAddTransaction}
        />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-semibold">Transactions</h2>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
                    <option value="all">All Categories</option>
                    {categories.expense.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
        </div>
              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleUpdateTransaction}
                onDelete={handleDeleteTransaction}
                categories={categories}
              />
            </section>
        </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Spending Overview</h2>
              <ExpenseChart transactions={transactions} />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Budget Limits</h2>
              <BudgetSection
                budgets={budgets}
                categories={categories.expense}
                onAddBudget={handleAddBudget}
              />
            </section>
          </aside>
      </main>
      </div>
    </div>
  );
}
