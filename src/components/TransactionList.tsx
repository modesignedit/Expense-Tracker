import { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryFilter } from '@/components/CategoryFilter';

interface TransactionListProps {
  transactions: Transaction[];
  categories: string[];
  onDelete: (id: string) => void;
}

/**
 * TransactionList Component
 * Displays a filterable list of all transactions
 * Each transaction shows type, amount, category, description, and date
 */
export function TransactionList({ transactions, categories, onDelete }: TransactionListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter transactions by selected category
  const filteredTransactions = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
          {/* Category filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet.</p>
            <p className="text-sm mt-1">Add your first transaction above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card transaction-item animate-slide-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {/* Type Icon */}
                <div
                  className={`p-2 rounded-full shrink-0 ${
                    transaction.type === 'income'
                      ? 'bg-income/10 text-income'
                      : 'bg-expense/10 text-expense'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{transaction.category}</p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  {transaction.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {transaction.description}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <p
                  className={`font-semibold shrink-0 ${
                    transaction.type === 'income' ? 'text-income' : 'text-expense'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
