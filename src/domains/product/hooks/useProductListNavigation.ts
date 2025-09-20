'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SortBy, SortOrder } from '@/domains/product/types/product';
import { mapInhaleTypeIdToUrl } from '@/domains/product/types/category';
import { ROUTES } from '@/app/router/routes';

// URL 업데이트 상수
const URL_DEFAULTS = {
  REMOVE_VALUES: [null, '', 'all'],
  DEFAULT_PAGE: 1,
  SCROLL_OPTIONS: { top: 0, behavior: 'smooth' as const }
} as const;

// 카테고리 업데이트 로직 (순수 함수로 분리)
const updateCategoryParams = (
  selectedCategories: string[], 
  categoryId: string
): { category: string | null; categories: string | null } => {
  let newCategories: string[];
  
  if (selectedCategories.includes(categoryId)) {
    // 카테고리 제거
    newCategories = selectedCategories.filter(c => c !== categoryId);
  } else {
    // 카테고리 추가 (다중 선택 지원)
    newCategories = [...selectedCategories, categoryId];
  }
  
  // URL 파라미터 결정
  if (newCategories.length === 0) {
    return { category: null, categories: null };
  } else if (newCategories.length === 1) {
    return { category: newCategories[0], categories: null };
  } else {
    return { category: null, categories: newCategories.join(',') };
  }
};

export interface ProductListNavigationHandlers {
  updateURL: (updates: Record<string, string | number | null>) => void;
  handleProductClick: (productId: string) => void;
  handleSearch: (query: string) => void;
  handleSortChange: (newSortBy: SortBy) => void;
  handleCategoryChange: (categoryId: string) => void;
  handleInhaleTypeChange: (inhaleTypeId: string) => void;
  clearAllFilters: () => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (newItemsPerPage: number) => void;
}

export interface UseProductListNavigationParams {
  selectedCategories: string[];
  selectedInhaleTypes: string[]; // InhaleType ID들 ('MTL', 'DL')
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export function useProductListNavigation({
  selectedCategories,
  selectedInhaleTypes,
  sortBy,
  sortOrder,
}: UseProductListNavigationParams): ProductListNavigationHandlers {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL 업데이트 헬퍼 함수
  const updateURL = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || value === URL_DEFAULTS.DEFAULT_PAGE) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const handleProductClick = useCallback((productId: string) => {
    router.push(ROUTES.PRODUCT.DETAIL(productId));
  }, [router]);

  const handleSearch = useCallback((query: string) => {
    updateURL({ q: query, page: null });
  }, [updateURL]);

  const handleSortChange = useCallback((newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      updateURL({ sortBy: newSortBy, sortOrder: newSortOrder, page: null });
    } else {
      updateURL({ sortBy: newSortBy, sortOrder: 'desc', page: null });
    }
  }, [sortBy, sortOrder, updateURL]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    const categoryParams = updateCategoryParams(selectedCategories, categoryId);
    updateURL({ 
      ...categoryParams, 
      page: null 
    });
  }, [selectedCategories, updateURL]);

  const handleInhaleTypeChange = useCallback((inhaleTypeId: string) => {
    const urlValues = mapInhaleTypeIdToUrl([inhaleTypeId]);
    const urlValue = urlValues[0] || inhaleTypeId;

    if (selectedInhaleTypes.includes(inhaleTypeId)) {
      // 호흡방식 제거
      updateURL({ subCategory: null, page: null });
    } else {
      // 호흡방식 추가 (현재는 단일 선택만 지원)
      updateURL({ subCategory: urlValue, page: null });
    }
  }, [selectedInhaleTypes, updateURL]);

  const clearAllFilters = useCallback(() => {
    updateURL({ 
      q: null, 
      category: null, 
      subCategory: null, 
      sortBy: null, 
      sortOrder: null, 
      page: null,
      limit: null
    });
  }, [updateURL]);

  const handlePageChange = useCallback((page: number) => {
    updateURL({ page });
    window.scrollTo(URL_DEFAULTS.SCROLL_OPTIONS);
  }, [updateURL]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    updateURL({ limit: newItemsPerPage, page: null });
  }, [updateURL]);

  return {
    updateURL,
    handleProductClick,
    handleSearch,
    handleSortChange,
    handleCategoryChange,
    handleInhaleTypeChange,
    clearAllFilters,
    handlePageChange,
    handleItemsPerPageChange,
  };
}