'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getUser, removeToken, removeUser } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const updateAuthState = () => {
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  };

  useEffect(() => {
    setMounted(true);
    updateAuthState();
  }, []);

  // Listen for route changes to update auth state
  useEffect(() => {
    updateAuthState();
  }, [pathname]);

  // Listen for storage changes (when login/logout happens)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        updateAuthState();
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab changes
    const handleCustomStorageChange = () => {
      updateAuthState();
    };
    window.addEventListener('auth-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleCustomStorageChange);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    // Dispatch custom event to update navbar immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
    updateAuthState();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl font-bold text-white hover:scale-105 transition-transform duration-200 min-h-[44px]"
            >
              <span className="text-2xl md:text-4xl">💰</span>
              <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent hidden sm:inline">
                Budget Manager
              </span>
              <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent sm:hidden">
                Budget
              </span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="min-w-[44px] min-h-[44px] p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {!mounted ? (
              <div className="w-16 md:w-24 h-8 md:h-10 bg-white/20 rounded-full animate-pulse"></div>
            ) : authenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-3 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm md:text-base">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium text-sm md:text-base hidden md:inline">
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="min-h-[44px] px-4 md:px-6 py-2 bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="min-h-[44px] px-4 md:px-6 py-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 font-medium text-sm md:text-base"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="min-h-[44px] px-4 md:px-6 py-2 bg-white text-indigo-600 rounded-full hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
