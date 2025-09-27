'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUserReviews } from './useMyPageQueries';
import { ROUTES } from '@/app/router/routes';
import { toast } from 'react-hot-toast';
import { Review } from '@/domains/review/types/review';
import { formatDate as formatDateUtil } from '@/shared/utils/Format';

export function useMyReviewsPage() {
  const router = useRouter();
  const { user } = useAuthUtils();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  
  const { data: reviewsData, isLoading, error } = useUserReviews(
    user?.id || '', 
    currentPage, 
    limit
  );

  const reviews = useMemo(() => reviewsData?.data || [], [reviewsData?.data]);
  const totalCount = useMemo(() => reviewsData?.pagination?.total || 0, [reviewsData?.pagination?.total]);
  const totalPages = useMemo(() => reviewsData?.pagination?.totalPages || 0, [reviewsData?.pagination?.totalPages]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateToProducts = useCallback(() => {
    router.push(ROUTES.PRODUCT.LIST);
  }, [router]);

  const handleViewReview = useCallback((review: Review) => {
    // 해당 리뷰의 상품 상세 페이지로 이동
    router.push(ROUTES.PRODUCT.DETAIL(review.productId));
  }, [router]);

  const formatDate = useCallback((date: Date) => {
    return formatDateUtil(date);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error('내 리뷰를 불러오는데 실패했습니다.');
    }
  }, [error]);

  return {
    reviews,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    handleNavigateToProducts,
    handleViewReview,
    formatDate
  };
}