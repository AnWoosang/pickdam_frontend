"use client";

import { useCallback } from 'react';
import { useHomeData } from './useHomeQueries';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

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
  const { bestSellers, popularProducts, isLoading, error, refetch } = useHomeData({
    bestSellersLimit: HOME_PAGE_DEFAULTS.BESTSELLERS_LIMIT,
    popularProductsLimit: HOME_PAGE_DEFAULTS.POPULAR_PRODUCTS_LIMIT,
  });

  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );

  // 재시도 핸들러
  const handleRetry = useCallback(() => {
    try {
      console.log('홈 데이터 재시도 시작');
      refetch();
    } catch (error) {
      const processedError = createErrorHandler('홈 데이터 재시도에 실패했습니다.')(error);
      console.error('Home data retry failed:', processedError);
    }
  }, [refetch, createErrorHandler]);

  // 에러 상태 처리
  const processedError = error ? createErrorHandler('홈 데이터를 불러오는데 실패했습니다.')(error) : null;

  return {
    // 데이터
    bestSellers,
    popularProducts,
    
    // 상태
    isLoading,
    hasError: !!error,
    errorMessage: processedError?.message || null,
    
    // 액션
    onRetry: handleRetry,
  };
};