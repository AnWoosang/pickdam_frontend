'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SortBy,
  SortOrder,
  isValidSortBy,
  isValidSortOrder,
  mapUrlToInhaleTypeIds
} from '@/domains/product/types/product';

// 페이지네이션 상수
const PAGINATION_LIMITS = {
  MIN_PAGE: 1,
  DEFAULT_PAGE: 1,
  MIN_ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,
  DEFAULT_ITEMS_PER_PAGE: 20
} as const;

export interface ProductListFilters {
  // URL 파라미터
  category: string | null;
  categories: string | null;
  subCategory: string | null;
  searchQuery: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  currentPage: number;
  itemsPerPage: number;
  
  // 파싱된 필터 상태
  selectedCategories: string[];
  selectedInhaleTypes: string[]; // InhaleType ID들 ('MTL', 'DL')
}

// 카테고리 파싱 유틸리티 함수 (컴포넌트 외부로 분리)
const parseSelectedCategories = (category: string | null, categories: string | null): string[] => {
  // categories 파라미터 우선 (다중 카테고리)
  if (categories) {
    return categories
      .split(',')
      .map(c => c.trim())
      .filter(c => c && c !== 'all');
  }
  // 단일 카테고리 fallback
  if (category && category !== 'all') {
    return [category];
  }
  return [];
};

export function useProductListFilters(): ProductListFilters {
  const searchParams = useSearchParams();
  
  // URL에서 파라미터 읽기 (메모이제이션을 위해 개별 변수로 분리)
  const category = useMemo(() => searchParams.get('category'), [searchParams]);
  const categories = useMemo(() => searchParams.get('categories'), [searchParams]);
  const subCategory = useMemo(() => searchParams.get('subCategory'), [searchParams]);
  const searchQuery = useMemo(() => searchParams.get('q') || '', [searchParams]);
  
  // 정렬 파라미터 검증 (메모이제이션)
  const sortBy: SortBy = useMemo(() => {
    const sortByParam = searchParams.get('sortBy');
    return (sortByParam && isValidSortBy(sortByParam)) ? sortByParam : 'total_views';
  }, [searchParams]);
  
  const sortOrder: SortOrder = useMemo(() => {
    const sortOrderParam = searchParams.get('sortOrder');
    return (sortOrderParam && isValidSortOrder(sortOrderParam)) ? sortOrderParam : 'desc';
  }, [searchParams]);
  
  // 페이지네이션 파라미터 (메모이제이션)
  const currentPage = useMemo(() => {
    return Math.max(PAGINATION_LIMITS.MIN_PAGE, parseInt(searchParams.get('page') || PAGINATION_LIMITS.DEFAULT_PAGE.toString()));
  }, [searchParams]);
  
  const itemsPerPage = useMemo(() => {
    const limit = parseInt(searchParams.get('limit') || PAGINATION_LIMITS.DEFAULT_ITEMS_PER_PAGE.toString());
    return Math.min(Math.max(PAGINATION_LIMITS.MIN_ITEMS_PER_PAGE, limit), PAGINATION_LIMITS.MAX_ITEMS_PER_PAGE);
  }, [searchParams]);
  
  // 카테고리 필터 상태 (분리된 함수 사용 + 최적화된 의존성)
  const selectedCategories = useMemo(() => {
    return parseSelectedCategories(category, categories);
  }, [category, categories]);
  
  // 호흡방식 필터 상태 (최적화된 의존성)
  const selectedInhaleTypes = useMemo(() => {
    return mapUrlToInhaleTypeIds(subCategory);
  }, [subCategory]);

  return {
    category,
    categories,
    subCategory,
    searchQuery,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    selectedCategories,
    selectedInhaleTypes,
  };
}