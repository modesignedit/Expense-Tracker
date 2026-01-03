import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRange, getDateRangeLabel } from '@/utils/dateFilters';

interface DateRangeFilterProps {
  selectedRange: DateRange;
  onSelect: (range: DateRange) => void;
}

const DATE_RANGES: DateRange[] = ['all', 'today', 'week', 'month'];

/**
 * DateRangeFilter Component
 * Allows users to filter transactions by time period
 * Options: All Time, Today, This Week, This Month
 */
export function DateRangeFilter({ selectedRange, onSelect }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">Period:</span>
      </div>
      {DATE_RANGES.map((range) => (
        <Button
          key={range}
          variant={selectedRange === range ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(range)}
          className="text-xs"
        >
          {getDateRangeLabel(range)}
        </Button>
      ))}
    </div>
  );
}
