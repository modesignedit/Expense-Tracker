import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

/**
 * CategoryFilter Component
 * Displays filter buttons for each category
 * Allows filtering transactions by category
 */
export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {/* All button - clears filter */}
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(null)}
        className="text-xs"
      >
        All
      </Button>
      
      {/* Category buttons */}
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(category)}
          className="text-xs"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
