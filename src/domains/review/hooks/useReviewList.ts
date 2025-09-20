'use client';

import { useMemo, useEffect, useState } from 'react';
import { useProductReviews, useUpdateReview, useDeleteReview } from './useReviewQueries';
import { Review } from '@/domains/review/types/review';

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

  // 로컬 상태로 즉시 반영 관리
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  useEffect(() => {
    // React Query가 데이터를 가져왔을 때만 localReviews 업데이트
    if (allReviews.length > 0 || (allReviews.length === 0 && !isLoading)) {
      setLocalReviews([...allReviews]);
    }
  }, [allReviews.length, isLoading, productId]);

  // 정렬 및 필터링 로직
  const processedReviews = useMemo(() => {
    if (!filters) return localReviews;

    // 정렬 적용
    const sortedReviews = [...localReviews].sort((a, b) => {
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
  }, [localReviews, filters]);

  // 페이지네이션 적용
  const paginationData = useMemo(() => {
    if (!filters) {
      return {
        currentPageReviews: localReviews,
        totalFilteredPages: 1,
        totalReviews: localReviews.length
      };
    }

    const totalFilteredPages = Math.ceil(processedReviews.length / reviewsPerPage);
    const startIndex = (filters.currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentPageReviews = processedReviews.slice(startIndex, endIndex);

    return {
      currentPageReviews,
      totalFilteredPages,
      totalReviews: localReviews.length
    };
  }, [processedReviews, filters, reviewsPerPage, localReviews]);

  // 리뷰 수정 비즈니스 로직
  const handleUpdateReview = async (updatedReview: Review): Promise<boolean> => {
    try {
      console.log('🔄 [handleUpdateReview] 뮤테이션 시작:', { reviewId: updatedReview.id, productId });

      await updateReviewMutation.mutateAsync({
        updates: updatedReview
      });

      // 성공 시 즉시 localReviews 업데이트
      setLocalReviews(prev => {
        const updatedData = prev.map(review =>
          review.id === updatedReview.id ? { ...review, ...updatedReview } : review
        );

        console.log('🎯 [handleUpdateReview] localReviews 즉시 업데이트:', {
          originalCount: prev.length,
          updatedCount: updatedData.length,
          updated: updatedData.find(r => r.id === updatedReview.id)
        });

        return updatedData;
      });

      console.log('✅ [handleUpdateReview] 뮤테이션 성공:', updatedReview.id);
      return true;
    } catch (error) {
      console.error('❌ [handleUpdateReview] 리뷰 수정 실패:', error);
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