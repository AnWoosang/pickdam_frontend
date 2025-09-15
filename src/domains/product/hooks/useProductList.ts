'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useProductListFilters } from './useProductListFilters';
import { useProductListData } from './useProductListData';
import { useProductListNavigation } from './useProductListNavigation';

export function useProductList() {
  // 기존 훅들 사용
  const filters = useProductListFilters();
  
  const { products, isLoading, totalCount, totalPages, hasError, errorMessage } = useProductListData({
    searchQuery: filters.searchQuery,
    selectedCategories: filters.selectedCategories,
    selectedInhaleTypes: filters.selectedInhaleTypes,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    currentPage: filters.currentPage,
    itemsPerPage: filters.itemsPerPage,
  });
  
  const navigation = useProductListNavigation({
    selectedCategories: filters.selectedCategories,
    selectedInhaleTypes: filters.selectedInhaleTypes,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  // 에러 처리: toast로 에러 메시지 표시
  useEffect(() => {
    if (hasError && errorMessage) {
      toast.error(errorMessage);
    }
  }, [hasError, errorMessage]);

  // 통합된 인터페이스 반환
  return {
    // 상태
    filters,
    products,
    isLoading,
    totalCount,
    totalPages,
    hasError,
    errorMessage,
    
    // 핸들러들
    ...navigation,
  };
}