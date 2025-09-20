import React, { useMemo } from 'react';
import { Button } from '@/shared/components/Button';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { PostCategoryId } from '@/domains/community/types/community';
import { POST_CATEGORIES } from '@/domains/community/types/community';
interface CategorySelectorProps {
  value: PostCategoryId | '';
  onChange: (updates: { categoryId: PostCategoryId }) => void;
  onErrorChange: (errors: { category?: string }) => void;
  error?: string;
}

export const CategorySelector = React.memo(function CategorySelector({
  value,
  onChange,
  onErrorChange,
  error
}: CategorySelectorProps) {
  const { canWriteNotice } = useAuthUtils();

  const categoryEntries = useMemo(() => {
    const allCategories = Object.entries(POST_CATEGORIES) as [PostCategoryId, string][];

    // 관리자가 아니면 공지사항 카테고리 제외
    if (!canWriteNotice) {
      return allCategories.filter(([categoryId]) => categoryId !== 'NOTICE');
    }

    return allCategories;
  }, [canWriteNotice]);

  const handleCategoryChange = (categoryId: PostCategoryId) => {
    onChange({ categoryId });
    if (error) {
      onErrorChange({ category: undefined });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        카테고리 <span className="text-red-500">*</span>
      </label>
      
      <div className="flex flex-wrap gap-2">
        {categoryEntries.map(([categoryId, categoryName]) => {
          const isSelected = value === categoryId;
          return (
            <Button
              key={categoryId}
              type="button"
              variant="secondary"
              size="small"
              onClick={() => handleCategoryChange(categoryId)}
              noFocus={true}
              className={isSelected ? 'bg-primary text-white border-primary' : ''}
            >
              {categoryName}
            </Button>
          );
        })}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});