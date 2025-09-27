'use client';

import { useState, useEffect } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useRecentProducts } from '@/domains/user/hooks/useRecentProducts';
import { 
  useProduct, 
  useIncrementProductViews
} from './useProductQueries';
import { Product } from '@/domains/product/types/product';

export const useProductDetail = (productId: string) => {
  const { isLoading: authLoading } = useAuthUtils();
  const { addProduct: addRecentProduct } = useRecentProducts();
  
  // useProduct 훅 사용
  const { data: productDetail, isLoading, error } = useProduct(productId);

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
      incrementViewsMutation.mutate({productId: productDetail.id}, {
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
    queryError: !!error,
    viewCount,
  };
};