import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'expense-tracker-transactions';

/**
 * Custom hook for managing transactions with localStorage persistence
 * Handles CRUD operations and calculates financial summaries
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      } catch (e) {
        console.error('Failed to parse stored transactions:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist transactions to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  // Add a new transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(), // Generate unique ID
    };
    setTransactions(prev => [newTransaction, ...prev]); // Add to beginning (most recent first)
  }, []);

  // Delete a transaction by ID
  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Calculate total income: sum of all income transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses: sum of all expense transactions
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate balance: income minus expenses
  const balance = totalIncome - totalExpenses;

  // Get unique categories from all transactions
  const categories = [...new Set(transactions.map(t => t.category))];

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    categories,
    isLoaded,
  };
}
