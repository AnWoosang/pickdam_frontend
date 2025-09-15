'use client';

import React, { useMemo } from 'react';
import { POST_CATEGORIES, PostCategoryId } from '@/domains/community/types/community';
import { Button } from '@/shared/components/Button';

interface CategoryFilterProps {
  selectedCategory: PostCategoryId | 'all';
  onCategoryChange: (category: PostCategoryId | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(function CategoryFilter({
  selectedCategory,
  onCategoryChange
}) {
  const categoryEntries = useMemo(() => 
    Object.entries(POST_CATEGORIES) as [PostCategoryId, string][], 
    []
  );

  return (
    <div className="mb-8">
      <div className="block text-lg font-bold text-black mb-2">
        카테고리 필터
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onCategoryChange('all')}
          className="rounded-full"
          noFocus={true}
        >
          전체
        </Button>
        {categoryEntries.map(([categoryId, categoryName]) => (
          <Button
            key={categoryId}
            variant={selectedCategory === categoryId ? 'primary' : 'secondary'}
            size="small"
            onClick={() => onCategoryChange(categoryId)}
            className="rounded-full"
            noFocus={true}
          >
            {categoryName}
          </Button>
        ))}
      </div>
    </div>
  );
});