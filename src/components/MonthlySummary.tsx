import { useMemo } from 'react';
import { format, startOfMonth, subMonths, isWithinInterval, endOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';

interface MonthlySummaryProps {
  transactions: Transaction[];
}

/**
 * MonthlySummary Component
 * Displays monthly income vs expenses chart and category breakdown
 * Shows last 6 months of data
 */
export function MonthlySummary({ transactions }: MonthlySummaryProps) {
  /**
   * Calculate monthly data for bar chart
   * Groups transactions by month and calculates income/expense totals
   */
  const monthlyData = useMemo(() => {
    const months: { month: string; income: number; expenses: number }[] = [];
    const now = new Date();

    // Generate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(monthStart);
      const monthLabel = format(monthStart, 'MMM');

      // Filter transactions for this month
      const monthTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
      );

      // Calculate totals for the month
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({ month: monthLabel, income, expenses });
    }

    return months;
  }, [transactions]);

  /**
   * Calculate category breakdown for pie chart
   * Groups expenses by category for current month
   */
  const categoryData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get this month's expenses only
    const monthExpenses = transactions.filter(
      (t) =>
        t.type === 'expense' &&
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    // Group by category and sum amounts
    const categoryMap = new Map<string, number>();
    monthExpenses.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    // Convert to array for chart
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Colors for pie chart segments
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--expense))',
    'hsl(var(--income))',
    'hsl(var(--accent-foreground))',
    'hsl(var(--muted-foreground))',
  ];

  // Format currency for tooltips
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);

  // Check if we have any data to display
  const hasBarData = monthlyData.some((m) => m.income > 0 || m.expenses > 0);
  const hasPieData = categoryData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Income vs Expenses Bar Chart */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Income vs Expenses (Last 6 months)</p>
        </CardHeader>
        <CardContent>
          {hasBarData ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="income" 
                  name="Income"
                  fill="hsl(var(--income))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses"
                  fill="hsl(var(--expense))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p>No transaction data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown Pie Chart */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Expense Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">This month's expenses by category</p>
        </CardHeader>
        <CardContent>
          {hasPieData ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p>No expenses this month</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
