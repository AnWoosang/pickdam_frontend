'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useRecentProducts } from '@/domains/user/hooks/useRecentProducts';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';
import { 
  useProduct, 
  useIncrementProductViews
} from './useProductQueries';
import { Product } from '@/domains/product/types/product';

export const useProductDetail = (productId: string) => {
  const { isLoading: authLoading } = useAuthUtils();
  const { addProduct: addRecentProduct } = useRecentProducts();
  
  // useProduct 훅 사용
  const { data: productDetail, isLoading, error, refetch } = useProduct(productId);

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
      refetch();
    } catch (error) {
      const processedError = createErrorHandler('상품 데이터 재시도에 실패했습니다.')(error);
      console.error('Product data retry failed:', processedError);
    }
  }, [refetch, createErrorHandler]);

  // 에러 상태 처리
  const processedError = error ? createErrorHandler('상품 정보를 불러오는데 실패했습니다.')(error) : null;
  
  // Mutations
  const incrementViewsMutation = useIncrementProductViews();
  
  const [viewCount, setViewCount] = useState(0);


  // viewCount 초기화
  useEffect(() => {
    if (productDetail) {
      setViewCount(productDetail.totalViews || 0);
    }
  }, [productDetail]);

  // 최근 본 상품 추가
  useEffect(() => {
    if (productDetail) {
      addRecentProduct(productDetail as Product);
    }
  }, [productDetail, addRecentProduct]);

  // 조회수 증가
  useEffect(() => {
    if (!productDetail || authLoading) return;

    const viewKey = `product_view_${productDetail.id}`;
    const hasViewed = sessionStorage.getItem(viewKey);
    
    if (!hasViewed) {
      incrementViewsMutation.mutate({
        productId: productDetail.id
      }, {
        onSuccess: (newViewCount) => {
          setViewCount(newViewCount);
        }
      });
      
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [productDetail?.id, productDetail, authLoading, incrementViewsMutation]);
  


  return {
    // 데이터
    product: productDetail || null, // undefined면 null 반환
    sellers: productDetail?.sellers || [],
    averageReview: productDetail?.averageReviewInfo,
    priceHistory: productDetail?.priceHistory || [],
    
    // 상태
    isLoading,
    hasError: !!error,
    errorMessage: processedError?.message || null,
    viewCount,
    
    // 액션
    onRetry: handleRetry,
  };
};