'use client';

import { useMemo, useReducer, useCallback } from 'react';
import { useProductReviews, useUpdateReview, useDeleteReview } from './useReviewQueries';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { Review } from '@/domains/review/types/review';

type SortOption = 'latest' | 'oldest' | 'highest' | 'lowest';

interface ReviewFilters {
  sortBy: SortOption;
  selectedRating: number | null;
  showImagesOnly: boolean;
  currentPage: number;
}

// 필터 액션 타입들
type FilterAction =
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'SET_RATING'; payload: number | null }
  | { type: 'SET_IMAGES_ONLY'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET_TO_FIRST_PAGE' };

// 필터 리듀서
const filtersReducer = (state: ReviewFilters, action: FilterAction): ReviewFilters => {
  switch (action.type) {
    case 'SET_SORT':
      return { ...state, sortBy: action.payload, currentPage: 1 };
    case 'SET_RATING':
      return { ...state, selectedRating: action.payload, currentPage: 1 };
    case 'SET_IMAGES_ONLY':
      return { ...state, showImagesOnly: action.payload, currentPage: 1 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'RESET_TO_FIRST_PAGE':
      return { ...state, currentPage: 1 };
    default:
      return state;
  }
};

const initialFilters: ReviewFilters = {
  sortBy: 'latest',
  selectedRating: null,
  showImagesOnly: false,
  currentPage: 1
};

interface UseReviewsProps {
  productId: string;
  reviewsPerPage?: number;
}

export function useReviews({
  productId,
  reviewsPerPage = 5 // 기본 페이지당 리뷰 수
}: UseReviewsProps) {
  const { showToast } = useUIStore();
  const { user } = useAuthUtils();
  const [filters, dispatchFilters] = useReducer(filtersReducer, initialFilters);

  // React Query 호출
  const { data: allReviews = [], isLoading, error } = useProductReviews(productId);
  const queryError = !!error;
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  // React Query 캐시를 직접 사용 (Optimistic Update를 위해)
  const localReviews = allReviews;

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
  const handleUpdateReview = useCallback((updatedReview: Review): void => {
    updateReviewMutation.mutate({
      updates: updatedReview
    }, {
      onSuccess: () => {
        // React Query 캐시에서 자동으로 업데이트됨 (useUpdateReview에서 처리)
        showToast('리뷰가 수정되었습니다.', 'success');
      },
      onError: () => {
        showToast('리뷰 수정에 실패했습니다.', 'error');
      }
    });
  }, [updateReviewMutation, showToast]);

  // 리뷰 삭제 비즈니스 로직
  const handleDeleteReview = useCallback((reviewId: string): void => {
    deleteReviewMutation.mutate({
      reviewId,
      productId
    }, {
      onSuccess: () => {
        showToast('리뷰가 삭제되었습니다.', 'success');
      },
      onError: () => {
        showToast('리뷰 삭제에 실패했습니다.', 'error');
      }
    });
  }, [deleteReviewMutation, productId, showToast]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    dispatchFilters({ type: 'SET_PAGE', payload: page });
  }, []);

  // 리뷰 수정 저장
  const handleSaveReview = useCallback((updatedReview: Review) => {
    if (!updatedReview || !user?.id) return;
    handleUpdateReview(updatedReview);
  }, [user?.id, handleUpdateReview]);

  // 본인이 작성한 리뷰인지 확인
  const isMyReview = useCallback((review: Review) => {
    return user?.id === review.memberId;
  }, [user?.id]);

  // 필터 핸들러들
  const handleSortChange = useCallback((sortBy: SortOption) => {
    dispatchFilters({ type: 'SET_SORT', payload: sortBy });
  }, []);

  const handleRatingFilter = useCallback((rating: number | null) => {
    dispatchFilters({ type: 'SET_RATING', payload: rating });
  }, []);

  const handleImagesOnlyToggle = useCallback((checked: boolean) => {
    dispatchFilters({ type: 'SET_IMAGES_ONLY', payload: checked });
  }, []);

  return {
    // 데이터
    filters,
    currentPageReviews: paginationData.currentPageReviews,
    totalFilteredPages: paginationData.totalFilteredPages,
    totalReviews: paginationData.totalReviews,
    allReviews,

    // 상태
    isLoading,
    queryError,

    // 핸들러
    handlePageChange,
    handleSaveReview,
    handleDeleteReview,
    handleSortChange,
    handleRatingFilter,
    handleImagesOnlyToggle,

    // 유틸리티
    isMyReview
  };
}