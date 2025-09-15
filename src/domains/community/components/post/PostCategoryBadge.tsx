'use client';

import React from 'react';
import { getCategoryName, isValidCategoryId, PostCategoryId } from '@/domains/community/types/community';

export interface PostCategoryBadgeProps {
  categoryId: PostCategoryId | string | undefined;
  className?: string;
}

// 카테고리별 색상 매핑 (UI에서 관리)
const CATEGORY_COLORS: Record<string, string> = {
  'NOTICE': 'bg-red-500',
  'GENERAL': 'bg-gray-500',
  'REVIEW': 'bg-green-500', 
  'QUESTION': 'bg-blue-500',
};

export function PostCategoryBadge({ categoryId, className = '' }: PostCategoryBadgeProps) {
  if (!categoryId || !isValidCategoryId(categoryId)) return null;
  
  const categoryName = getCategoryName(categoryId);
  const colorClass = CATEGORY_COLORS[categoryId] || 'bg-gray-500';
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${colorClass} ${className}`}
    >
      {categoryName}
    </span>
  );
}