'use client';

import React, { useMemo } from 'react';
import { POST_CATEGORIES, PostCategoryId } from '@/domains/community/types/community';

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
    <div className="mb-2 md:mb-8">
      <div className="block text-sm md:text-lg font-semibold md:font-bold text-black mb-2.5 md:mb-2">
        카테고리 필터
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-lg md:rounded-full text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-grayLighter text-textDefault hover:bg-grayLight'
          }`}
        >
          전체
        </button>
        {categoryEntries.map(([categoryId, categoryName]) => (
          <button
            key={categoryId}
            onClick={() => onCategoryChange(categoryId)}
            className={`px-3 py-1.5 rounded-lg md:rounded-full text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === categoryId
                ? 'bg-primary text-white'
                : 'bg-grayLighter text-textDefault hover:bg-grayLight'
            }`}
          >
            {categoryName}
          </button>
        ))}
      </div>
    </div>
  );
});