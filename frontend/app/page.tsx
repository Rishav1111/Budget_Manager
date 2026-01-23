'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { transactionsApi, budgetsApi, Transaction, Budget, Stats } from '@/lib/api';
import { isAuthenticated, getUser, removeToken, removeUser } from '@/lib/auth';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import StatsCards from '@/components/StatsCards';
import BudgetSection from '@/components/BudgetSection';
import ChartSelector from '@/components/ChartSelector';
import SearchBar from '@/components/SearchBar';
import ExportModal from '@/components/ExportModal';
import BulkActionsBar from '@/components/BulkActionsBar';
import QuickActionButtons from '@/components/QuickActionButtons';
import TransactionTemplates from '@/components/TransactionTemplates';
import MobileBottomNav from '@/components/MobileBottomNav';
import InsightsPanel from '@/components/InsightsPanel';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<number>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [templatesRefreshKey, setTemplatesRefreshKey] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [transactionsData, budgetsData, statsData] = await Promise.all([
        transactionsApi.getAll().catch(() => []),
        budgetsApi.getWithSpending().catch(() => []),
        transactionsApi.getStats().catch(() => ({ totalIncome: 0, totalExpense: 0, balance: 0 })),
      ]);
      setTransactions(transactionsData || []);
      setBudgets(budgetsData || []);
      setStats(statsData || { totalIncome: 0, totalExpense: 0, balance: 0, incomeChange: 0, expenseChange: 0 });
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty defaults on error
      setTransactions([]);
      setBudgets([]);
      setStats({ totalIncome: 0, totalExpense: 0, balance: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Pull to refresh
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: loadData,
    enabled: true,
  });

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

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
      setSelectedTransactionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await refreshStats();
      await refreshBudgets();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTransactionIds.size === 0) return;
    
    try {
      const ids = Array.from(selectedTransactionIds);
      await transactionsApi.bulkDelete(ids);
      setTransactions(transactions.filter((t) => !selectedTransactionIds.has(t.id)));
      setSelectedTransactionIds(new Set());
      setIsSelectMode(false);
      await refreshStats();
      await refreshBudgets();
    } catch (error) {
      console.error('Error bulk deleting transactions:', error);
      alert('Failed to delete transactions. Please try again.');
    }
  };

  const handleBulkUpdate = async (field: 'category' | 'type' | 'date', value: string) => {
    if (selectedTransactionIds.size === 0) return;
    
    try {
      const ids = Array.from(selectedTransactionIds);
      const updateData: any = {};
      if (field === 'category') updateData.category = value;
      if (field === 'type') updateData.type = value;
      if (field === 'date') updateData.date = value;
      
      const updated = await transactionsApi.bulkUpdate(ids, updateData);
      
      // Update local state
      const updatedMap = new Map(updated.map((t) => [t.id, t]));
      setTransactions(
        transactions.map((t) => (updatedMap.has(t.id) ? updatedMap.get(t.id)! : t))
      );
      
      setSelectedTransactionIds(new Set());
      setIsSelectMode(false);
      await refreshStats();
      await refreshBudgets();
    } catch (error) {
      console.error('Error bulk updating transactions:', error);
      alert('Failed to update transactions. Please try again.');
    }
  };

  const handleSelectionChange = (id: number, selected: boolean) => {
    setSelectedTransactionIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTransactionIds(new Set(filteredTransactions.map((t) => t.id)));
    } else {
      setSelectedTransactionIds(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedTransactionIds(new Set());
    setIsSelectMode(false);
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
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesDescription = t.description.toLowerCase().includes(query);
      const matchesCategory = t.category.toLowerCase().includes(query);
      const matchesAmount = t.amount.toString().includes(query);
      if (!matchesDescription && !matchesCategory && !matchesAmount) return false;
    }
    
    return true;
  });

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Loading your finances...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20 pb-20 md:pb-8">
      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Refreshing...</span>
        </div>
      )}
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <header className="mb-8">
          <StatsCards stats={stats} />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section id="transaction-form-section" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg md:text-xl">➕</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Add Transaction
                </h2>
              </div>
              <TransactionForm
                categories={categories}
                onSubmit={handleAddTransaction}
                onLoadTemplate={() => {}}
                onSaveTemplate={(template) => {
                  // Prompt for template name
                  const templateName = prompt('Enter a name for this template:', `${template.description} (Rs.${template.amount})`);
                  
                  if (!templateName || !templateName.trim()) {
                    return; // User cancelled or entered empty name
                  }
                  
                  // Save template to localStorage
                  try {
                    const stored = localStorage.getItem('transaction_templates');
                    const templates = stored ? JSON.parse(stored) : [];
                    const newTemplate = {
                      id: Date.now().toString(),
                      name: templateName.trim(),
                      transaction: template,
                      createdAt: new Date().toISOString(),
                    };
                    templates.push(newTemplate);
                    localStorage.setItem('transaction_templates', JSON.stringify(templates));
                    // Trigger refresh of TransactionTemplates component
                    setTemplatesRefreshKey(prev => prev + 1);
                    alert('Template saved successfully!');
                  } catch (error) {
                    console.error('Error saving template:', error);
                    alert('Failed to save template. Please try again.');
                  }
                }}
              />
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <QuickActionButtons
                  onQuickAdd={handleAddTransaction}
                  recentTransactions={transactions.slice(0, 5)}
                />
              </div>
            </section>

            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg md:text-xl">📝</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Templates
                </h2>
              </div>
              <TransactionTemplates
                key={templatesRefreshKey}
                onUseTemplate={(template) => {
                  // Load template into form
                  if ((window as any).loadTransactionTemplate) {
                    (window as any).loadTransactionTemplate(template);
                  }
                  // Also submit it
                  handleAddTransaction(template);
                }}
              />
            </section>

            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center mb-4 md:mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <span className="text-lg md:text-xl">📋</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Transactions
                  </h2>
                </div>
                <div className="flex gap-2 flex-wrap w-full md:w-auto">
                  <div className="w-full md:w-auto md:min-w-[250px]">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  <button
                    onClick={() => setIsSelectMode(!isSelectMode)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                      isSelectMode
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">{isSelectMode ? 'Cancel Selection' : 'Select'}</span>
                    <span className="sm:hidden">{isSelectMode ? 'Cancel' : 'Select'}</span>
                  </button>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="min-h-[44px] px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="min-h-[44px] px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
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
                    className="min-h-[44px] px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                </div>
        </div>
              <BulkActionsBar
                selectedCount={selectedTransactionIds.size}
                onBulkDelete={handleBulkDelete}
                onBulkUpdate={handleBulkUpdate}
                onClearSelection={handleClearSelection}
                categories={categories}
              />
              <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={handleUpdateTransaction}
                  onDelete={handleDeleteTransaction}
                  categories={categories}
                  selectedIds={selectedTransactionIds}
                  onSelectionChange={handleSelectionChange}
                  onSelectAll={handleSelectAll}
                  isSelectMode={isSelectMode}
                />
              </div>
            </section>
        </div>

          <aside className="space-y-6">
            <InsightsPanel />

            <section id="charts-section" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg md:text-xl">📊</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  Analytics & Charts
                </h2>
              </div>
              <ChartSelector transactions={transactions} categories={categories} budgets={budgets} />
            </section>

            <section id="budgets-section" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 dark:border-gray-700/50 transform hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg md:text-xl">🎯</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Budget Limits
                </h2>
              </div>
              <BudgetSection
                budgets={budgets}
                categories={categories.expense}
                onAddBudget={handleAddBudget}
              />
            </section>
          </aside>
      </main>
      </div>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        transactions={transactions}
      />
      <MobileBottomNav />
    </div>
  );
}
