import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

/**
 * SummaryCards Component
 * Displays three cards showing total income, expenses, and balance
 * Uses semantic colors from the design system
 */
export function SummaryCards({ totalIncome, totalExpenses, balance }: SummaryCardsProps) {
  // Format currency with proper locale
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Income Card */}
      <Card className="card-income border animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Income
              </p>
              <p className="text-2xl font-semibold text-income">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-income/10">
              <TrendingUp className="h-5 w-5 text-income" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className="card-expense border animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-semibold text-expense">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-expense/10">
              <TrendingDown className="h-5 w-5 text-expense" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="card-balance border animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Balance
              </p>
              <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-income/10' : 'bg-expense/10'}`}>
              <Wallet className={`h-5 w-5 ${balance >= 0 ? 'text-income' : 'text-expense'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
