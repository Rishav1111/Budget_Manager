'use client';

import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const authenticated = isAuthenticated();

  if (!authenticated || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => router.push('/')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] transition-colors ${
            pathname === '/'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          aria-label="Home"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => {
            // Scroll to transaction form
            const formSection = document.getElementById('transaction-form-section');
            if (formSection) {
              formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Add Transaction"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs font-medium">Add</span>
        </button>

        <button
          onClick={() => {
            // Scroll to charts section
            const chartsSection = document.getElementById('charts-section');
            if (chartsSection) {
              chartsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Charts"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs font-medium">Charts</span>
        </button>

        <button
          onClick={() => {
            // Scroll to budgets section
            const budgetsSection = document.getElementById('budgets-section');
            if (budgetsSection) {
              budgetsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Budgets"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs font-medium">Budgets</span>
        </button>
      </div>
    </nav>
  );
}
