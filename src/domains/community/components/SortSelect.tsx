'use client';

import { PostSort } from '@/domains/community/types/community';

import React, { useMemo } from 'react';

interface SortSelectProps {
  sortBy: PostSort;
  onSortChange: (sortBy: PostSort) => void;
}

export const SortSelect = React.memo(function SortSelect({ sortBy, onSortChange }: SortSelectProps) {
  const sortOptions = useMemo(() => [
    { value: 'created_at' as PostSort, label: '최신순' },
    { value: 'view_count' as PostSort, label: '조회순' },
    { value: 'like_count' as PostSort, label: '좋아요순' },
  ], []);

  return (
    <div className="mb-2 md:mb-8">
      <label className="block text-sm md:text-lg font-semibold md:font-bold text-black mb-2.5 md:mb-2">정렬 필터</label>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`px-3 py-1.5 rounded-lg md:rounded-full text-sm font-medium transition-colors cursor-pointer ${
              sortBy === option.value
                ? 'bg-primary text-white'
                : 'bg-grayLighter text-textDefault hover:bg-grayLight'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});