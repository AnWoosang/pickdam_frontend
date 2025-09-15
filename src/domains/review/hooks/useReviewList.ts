'use client';

import { useMemo } from 'react';
import { useProductReviews, useUpdateReview, useDeleteReview } from './useReviewQueries';

type SortOption = 'latest' | 'oldest' | 'highest' | 'lowest';

interface ReviewFilters {
  sortBy: SortOption;
  selectedRating: number | null;
  showImagesOnly: boolean;
  currentPage: number;
}

interface UseReviewsProps {
  productId: string;
  filters?: ReviewFilters;
  reviewsPerPage?: number;
}

export function useReviews({ 
  productId, 
  filters, 
  reviewsPerPage = 5 // 기본 페이지당 리뷰 수
}: UseReviewsProps) {
  // React Query 호출
  const { data: allReviews = [], isLoading, error, refetch } = useProductReviews(productId);
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  // 정렬 및 필터링 로직
  const processedReviews = useMemo(() => {
    if (!filters) return allReviews;

    // 정렬 적용
    const sortedReviews = [...allReviews].sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    // 필터 적용
    const filteredReviews = sortedReviews.filter(review => {
      if (filters.selectedRating && review.rating !== filters.selectedRating) return false;
      if (filters.showImagesOnly && (!review.images || review.images.length === 0)) return false;
      return true;
    });

    return filteredReviews;
  }, [allReviews, filters]);

  // 페이지네이션 적용
  const paginationData = useMemo(() => {
    if (!filters) {
      return {
        currentPageReviews: allReviews,
        totalFilteredPages: 1,
        totalReviews: allReviews.length
      };
    }

    const totalFilteredPages = Math.ceil(processedReviews.length / reviewsPerPage);
    const startIndex = (filters.currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentPageReviews = processedReviews.slice(startIndex, endIndex);

    return {
      currentPageReviews,
      totalFilteredPages,
      totalReviews: allReviews.length
    };
  }, [processedReviews, filters, reviewsPerPage, allReviews]);

  // 리뷰 수정 비즈니스 로직
  const handleUpdateReview = async (params: {
    reviewId: string;
    memberId: string;
    updates: {
      content: string;
      rating: number;
      sweetness?: number;
      menthol?: number;
      throatHit?: number;
      body?: number;
      freshness?: number;
      images?: { image_url: string; image_order: number }[];
    };
  }): Promise<boolean> => {
    try {
      await updateReviewMutation.mutateAsync({
        reviewId: params.reviewId,
        updates: {
          ...params.updates,
          productId,
          memberId: params.memberId
        },
        productId
      });
      return true;
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      throw error;
    }
  };

  // 리뷰 삭제 비즈니스 로직
  const handleDeleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      await deleteReviewMutation.mutateAsync({
        reviewId,
        productId
      });
      return true;
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      throw error;
    }
  };

  // 데이터 새로고침
  const refreshReviews = async () => {
    await refetch();
  };

  return {
    // 원본 데이터
    allReviews,
    // 처리된 데이터
    reviews: paginationData.currentPageReviews,
    totalFilteredPages: paginationData.totalFilteredPages,
    totalReviews: paginationData.totalReviews,
    // 상태
    isLoading,
    error,
    
    // 액션
    handleUpdateReview,
    handleDeleteReview,
    refreshReviews
  };
}