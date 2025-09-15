'use client';

import { PostSort } from '@/domains/community/types/community';

import React, { useMemo } from 'react';
import { Button } from '@/shared/components/Button';

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
});