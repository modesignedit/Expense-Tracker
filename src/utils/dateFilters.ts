import { startOfDay, startOfWeek, startOfMonth, endOfDay, isWithinInterval } from 'date-fns';
import { Transaction } from '@/types/transaction';

/**
 * Date Range Filter Types
 * Defines the available time period filters
 */
export type DateRange = 'all' | 'today' | 'week' | 'month';

/**
 * Get date range boundaries based on filter type
 * Returns start and end dates for the selected period
 */
export function getDateRange(range: DateRange): { start: Date; end: Date } | null {
  if (range === 'all') return null;

  const now = new Date();
  const end = endOfDay(now);

  switch (range) {
    case 'today':
      return { start: startOfDay(now), end };
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 0 }), end };
    case 'month':
      return { start: startOfMonth(now), end };
    default:
      return null;
  }
}

/**
 * Filter transactions by date range
 * Returns only transactions within the specified period
 */
export function filterByDateRange(
  transactions: Transaction[],
  range: DateRange
): Transaction[] {
  const dateRange = getDateRange(range);
  
  // If 'all', return all transactions
  if (!dateRange) return transactions;

  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return isWithinInterval(transactionDate, dateRange);
  });
}

/**
 * Get label for date range filter
 */
export function getDateRangeLabel(range: DateRange): string {
  switch (range) {
    case 'all':
      return 'All Time';
    case 'today':
      return 'Today';
    case 'week':
      return 'This Week';
    case 'month':
      return 'This Month';
  }
}
