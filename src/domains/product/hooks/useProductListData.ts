'use client';

import { useMemo } from 'react';
import { Product, SortBy, SortOrder } from '@/domains/product/types/product';
import { ProductsRequestParamDto } from '@/domains/product/types/dto/productRequestDto';
import { useProducts } from './useProductQueries';

export interface ProductListDataState {
  products: Product[];
  isLoading: boolean;
  totalCount: number;
  totalPages: number;
  hasError: boolean;
  errorMessage: string | null;
}

export interface UseProductListDataParams {
  searchQuery: string;
  selectedCategories: string[];
  selectedInhaleTypes: string[]; // InhaleType ID들 ('MTL', 'DL')
  sortBy: string;
  sortOrder: string;
  currentPage: number;
  itemsPerPage: number;
}

export function useProductListData({
  searchQuery,
  selectedCategories,
  selectedInhaleTypes,
  sortBy,
  sortOrder,
  currentPage,
  itemsPerPage,
}: UseProductListDataParams): ProductListDataState {
  
  // useProducts에 전달할 파라미터 변환
  const queryParams = useMemo((): ProductsRequestParamDto => {
    // 호흡방식 ID를 API에 전달 (이미 'MTL', 'DL' 형태)
    const inhaleTypeForApi = selectedInhaleTypes[0] || undefined;

    return {
      search: searchQuery.trim() || undefined,
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      categories: selectedCategories.length > 1 ? selectedCategories : undefined,
      inhaleType: inhaleTypeForApi,
      sortBy: sortBy as SortBy,
      sortOrder: sortOrder as SortOrder,
      page: currentPage,
      limit: itemsPerPage
    };
  }, [searchQuery, selectedCategories, selectedInhaleTypes, sortBy, sortOrder, currentPage, itemsPerPage]);

  // React Query 훅 사용
  const { data, isLoading, error } = useProducts(queryParams);

  // 응답 데이터 변환
  const totalPages = useMemo(() => {
    return Math.ceil((data?.pagination?.total || 0) / itemsPerPage);
  }, [data?.pagination?.total, itemsPerPage]);

  return {
    products: data?.data || [],
    isLoading,
    totalCount: data?.pagination?.total || 0,
    totalPages,
    hasError: !!error,
    errorMessage: error?.message || null,
  };
}