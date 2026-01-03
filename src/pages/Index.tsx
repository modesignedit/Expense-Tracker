import { useState, useMemo } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { MonthlySummary } from '@/components/MonthlySummary';
import { DateRange, filterByDateRange } from '@/utils/dateFilters';

/**
 * ============================================
 * DATA STRUCTURE EXPLANATION
 * ============================================
 * 
 * Each transaction follows this structure:
 * {
 *   id: string,          // Unique identifier (UUID)
 *   type: 'income' | 'expense',  // Transaction type
 *   amount: number,      // Monetary value (always positive)
 *   category: string,    // Category label (e.g., "Food & Dining")
 *   description: string, // Optional user notes
 *   date: string         // ISO date string (e.g., "2024-01-15T10:30:00.000Z")
 * }
 * 
 * Transactions are stored as an array in localStorage.
 * The 'type' field determines if it's income or expense.
 * ============================================
 */

/**
 * Index Page - Main Dashboard
 * Displays the expense tracker with:
 * - Summary cards (totals)
 * - Date range filter
 * - Transaction form
 * - Transaction list with category filter
 * - Monthly summary charts
 */
const Index = () => {
  // State for date range filter
  const [dateRange, setDateRange] = useState<DateRange>('all');

  const {
    transactions,
    addTransaction,
    deleteTransaction,
    categories,
    isLoaded,
  } = useTransactions();

  /**
   * ============================================
   * TOTALS & BALANCE CALCULATION (Step-by-Step)
   * ============================================
   * 
   * Step 1: Filter transactions by selected date range
   *         (today, this week, this month, or all)
   * 
   * Step 2: Calculate Total Income
   *         - Filter only transactions where type === 'income'
   *         - Sum up all their amounts using reduce()
   * 
   * Step 3: Calculate Total Expenses
   *         - Filter only transactions where type === 'expense'
   *         - Sum up all their amounts using reduce()
   * 
   * Step 4: Calculate Balance
   *         - Balance = Total Income - Total Expenses
   *         - Positive = surplus (green)
   *         - Negative = deficit (red)
   * ============================================
   */
  const filteredTransactions = useMemo(
    () => filterByDateRange(transactions, dateRange),
    [transactions, dateRange]
  );

  // Step 2: Calculate total income from filtered transactions
  const totalIncome = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === 'income')  // Only income transactions
        .reduce((sum, t) => sum + t.amount, 0),  // Sum all amounts
    [filteredTransactions]
  );

  // Step 3: Calculate total expenses from filtered transactions
  const totalExpenses = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === 'expense')  // Only expense transactions
        .reduce((sum, t) => sum + t.amount, 0),  // Sum all amounts
    [filteredTransactions]
  );

  // Step 4: Calculate balance (income minus expenses)
  const balance = totalIncome - totalExpenses;

  // Get categories from filtered transactions for the category filter
  const filteredCategories = useMemo(
    () => [...new Set(filteredTransactions.map((t) => t.category))],
    [filteredTransactions]
  );

  // Show loading state while data is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your income and expenses
          </p>
        </header>

        {/* Date Range Filter */}
        <section className="mb-6">
          <DateRangeFilter selectedRange={dateRange} onSelect={setDateRange} />
        </section>

        {/* Summary Cards - Shows filtered totals */}
        <section className="mb-8">
          <SummaryCards
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
          />
        </section>

        {/* Monthly Summary Charts */}
        <section className="mb-8">
          <MonthlySummary transactions={transactions} />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form - Takes 1 column on large screens */}
          <aside className="lg:col-span-1">
            <TransactionForm onAdd={addTransaction} />
          </aside>

          {/* Transaction List - Takes 2 columns on large screens */}
          <main className="lg:col-span-2">
            <TransactionList
              transactions={filteredTransactions}
              categories={filteredCategories}
              onDelete={deleteTransaction}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
