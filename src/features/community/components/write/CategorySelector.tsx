import { Button } from '@/components/common/Button';
import { POST_CATEGORIES } from '@/constants/postCategories';

interface CategorySelectorProps {
  selectedCategoryId: string | undefined;
  onCategoryChange: (categoryId: string) => void;
  error?: string;
}

export function CategorySelector({ 
  selectedCategoryId, 
  onCategoryChange, 
  error 
}: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        카테고리 <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {POST_CATEGORIES.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <Button
              key={category.id}
              type="button"
              variant="secondary"
              size="small"
              onClick={() => onCategoryChange(category.id)}
              noFocus={true}
              style={isSelected ? {
                backgroundColor: category.color,
                color: 'white',
                borderColor: category.color
              } : undefined}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}