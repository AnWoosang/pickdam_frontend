'use client';

import React from 'react';
import { SortBy, SortOrder } from '@/domains/product/types/product';

// 정렬 기준 UI 표시명
const SORT_BY_OPTIONS: Record<SortBy, string> = {
  'totalViews': '인기순',
  'price': '가격순',
  'createdAt': '최신순',
  'name': '이름순'
};

export interface ProductSortAndViewProps {
  totalCount: number;
  isLoading: boolean;
  itemsPerPage: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSortChange: (sortBy: SortBy) => void;
}

export function ProductSortAndView({
  totalCount,
  isLoading,
  itemsPerPage,
  sortBy,
  sortOrder,
  onItemsPerPageChange,
  onSortChange
}: ProductSortAndViewProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-sm text-textDefault">
        총 {totalCount}개의 상품
        {isLoading && (
          <span className="ml-2 inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            <span className="ml-1">로딩 중...</span>
          </span>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* 보기 개수 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-textDefault">보기:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="px-3 py-1.5 border border-grayLight rounded-lg text-sm bg-white text-textDefault cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={20}>20개</option>
            <option value={30}>30개</option>
            <option value={50}>50개</option>
          </select>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex gap-2">
          {Object.entries(SORT_BY_OPTIONS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => onSortChange(key as SortBy)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                sortBy === key
                  ? 'bg-primary text-white'
                  : 'bg-grayLighter text-textDefault hover:bg-grayLight'
              }`}
            >
              {label}
              {sortBy === key && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}