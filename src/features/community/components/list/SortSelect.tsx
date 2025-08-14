'use client';

import React from 'react';
import { Button } from '@/components/common/Button';

export type SortBy = 'latest' | 'popular' | 'most_viewed' | 'most_liked';

interface SortSelectProps {
  sortBy: SortBy;
  onSortChange: (sortBy: SortBy) => void;
}

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'most_viewed', label: '조회순' },
  { value: 'most_liked', label: '좋아요순' },
] as const;

export const SortSelect: React.FC<SortSelectProps> = ({ sortBy, onSortChange }) => {
  return (
    <div className="mb-8">
      <label className="block text-lg font-bold text-black mb-2">정렬 필터</label>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? 'primary' : 'secondary'}
            size="small"
            onClick={() => onSortChange(option.value)}
            className="rounded-full"
            noFocus={true}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};