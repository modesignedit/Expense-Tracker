import { useTransactions } from '@/hooks/useTransactions';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';

/**
 * Index Page - Main Dashboard
 * Displays the expense tracker with summary cards, form, and transaction list
 * Layout: responsive grid with form on left, list on right (stacked on mobile)
 */
const Index = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    categories,
    isLoaded,
  } = useTransactions();

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
      <div className="container max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your income and expenses
          </p>
        </header>

        {/* Summary Cards - Always at top */}
        <section className="mb-8">
          <SummaryCards
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
          />
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
              transactions={transactions}
              categories={categories}
              onDelete={deleteTransaction}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
