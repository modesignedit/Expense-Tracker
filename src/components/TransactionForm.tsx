import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/transaction';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

/**
 * TransactionForm Component
 * Form for adding new income or expense transactions
 * Includes type toggle, amount input, category selection, and description
 */
export function TransactionForm({ onAdd }: TransactionFormProps) {
  // Form state
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Get categories based on transaction type
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0 || !category) return;

    // Create transaction object
    onAdd({
      type,
      amount: parsedAmount,
      category,
      description: description.trim(),
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

  // Reset category when type changes (categories are different)
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory('');
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={`flex-1 ${type === 'income' ? 'bg-income hover:bg-income/90 text-income-foreground' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Income
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className={`flex-1 ${type === 'expense' ? 'bg-expense hover:bg-expense/90 text-expense-foreground' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              <Minus className="h-4 w-4 mr-2" />
              Expense
            </Button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Category
            </label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Description (optional)
            </label>
            <Input
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={!amount || parseFloat(amount) <= 0 || !category}
          >
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
