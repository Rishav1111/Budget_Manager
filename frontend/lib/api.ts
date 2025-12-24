import axios from 'axios';
import { getToken, removeToken, removeUser } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Backend server is not running. Please start the backend server on port 3000.');
    }
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      removeToken();
      removeUser();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Budget {
  id: number;
  category: string;
  limit: number;
  spent?: number;
  percentage?: number;
}

export interface Stats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const transactionsApi = {
  getAll: () => api.get<Transaction[]>('/transactions').then((res) => res.data),
  getById: (id: number) =>
    api.get<Transaction>(`/transactions/${id}`).then((res) => res.data),
  create: (data: Omit<Transaction, 'id'>) =>
    api.post<Transaction>('/transactions', data).then((res) => res.data),
  update: (id: number, data: Partial<Transaction>) =>
    api.patch<Transaction>(`/transactions/${id}`, data).then((res) => res.data),
  delete: (id: number) =>
    api.delete(`/transactions/${id}`).then((res) => res.data),
  getStats: () => api.get<Stats>('/transactions/stats').then((res) => res.data),
};

export const budgetsApi = {
  getAll: () => api.get<Budget[]>('/budgets').then((res) => res.data),
  getWithSpending: () =>
    api.get<Budget[]>('/budgets/with-spending').then((res) => res.data),
  create: (data: Omit<Budget, 'id'>) =>
    api.post<Budget>('/budgets', data).then((res) => res.data),
  update: (id: number, data: Partial<Budget>) =>
    api.patch<Budget>(`/budgets/${id}`, data).then((res) => res.data),
  delete: (id: number) =>
    api.delete(`/budgets/${id}`).then((res) => res.data),
};

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: (data: LoginDto) =>
    api.post<AuthResponse>('/auth/login', data).then((res) => res.data),
  register: (data: RegisterDto) =>
    api.post<AuthResponse>('/auth/register', data).then((res) => res.data),
};
