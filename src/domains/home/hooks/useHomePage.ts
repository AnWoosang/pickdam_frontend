"use client";

import { useHomeData } from './useHomeQueries';

// 홈페이지 기본 설정
const HOME_PAGE_DEFAULTS = {
  BESTSELLERS_LIMIT: 10,
  POPULAR_PRODUCTS_LIMIT: 10,
} as const;

/**
 * 홈페이지 비즈니스 로직 훅
 * UI와 데이터 레이어 사이의 중간 레이어 역할
 */
export const useHomePage = () => {
  const { bestSellers, popularProducts, isLoading, error } = useHomeData({
    bestSellersLimit: HOME_PAGE_DEFAULTS.BESTSELLERS_LIMIT,
    popularProductsLimit: HOME_PAGE_DEFAULTS.POPULAR_PRODUCTS_LIMIT,
  });




  return {
    // 데이터
    bestSellers,
    popularProducts,

    // 상태
    isLoading,
    queryError: !!error,
  };
};