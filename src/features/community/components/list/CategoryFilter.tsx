'use client';

import React from 'react';
import { POST_CATEGORIES } from '@/constants/postCategories';
import { Button } from '@/components/common/Button';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="mb-8">
      <label className="block text-lg font-bold text-black mb-2">카테고리 필터</label>
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
        {POST_CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'secondary'}
            size="small"
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full ${
              selectedCategory === category.id ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? category.color : undefined,
            }}
            noFocus={true}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};