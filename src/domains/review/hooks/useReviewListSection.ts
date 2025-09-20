'use client';

import { useReducer, useCallback } from 'react';
import { Review } from '@/domains/review/types/review';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useReviews } from '@/domains/review/hooks/useReviewList';
import { toast } from 'react-hot-toast';

// 상수 정의
const REVIEWS_PER_PAGE = 5;

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

interface UseReviewListSectionParams {
  productId: string;
}

export const useReviewListSection = ({ productId }: UseReviewListSectionParams) => {
  const { user } = useAuthUtils();
  const [filters, dispatchFilters] = useReducer(filtersReducer, initialFilters);

  const { 
    reviews: currentPageReviews,
    totalFilteredPages,
    totalReviews,
    isLoading, 
    handleUpdateReview: updateReview, 
    handleDeleteReview: deleteReview 
  } = useReviews({ productId, filters, reviewsPerPage: REVIEWS_PER_PAGE });

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    dispatchFilters({ type: 'SET_PAGE', payload: page });
    // 스크롤은 컴포넌트에서 처리하도록 분리
  }, []);

  // 리뷰 수정 저장
  const handleSaveReview = useCallback(async (updatedReview: Review) => {
    if (!updatedReview || !user?.id) return;

    console.log('💾 [handleSaveReview] 리뷰 수정 시작:', { reviewId: updatedReview.id, productId: updatedReview.productId });

    try {
      await updateReview(updatedReview);
      console.log('✅ [handleSaveReview] 리뷰 수정 성공:', updatedReview.id);
      toast.success('리뷰가 수정되었습니다');
    } catch (error) {
      console.error('❌ [handleSaveReview] 리뷰 수정 실패:', error);
      toast.error('리뷰 수정 중 오류가 발생했습니다');
      throw error;
    }
  }, [user?.id, updateReview]);

  // 리뷰 삭제 핸들러
  const handleDeleteReview = useCallback(async (reviewId: string) => {
    try {
      // 비즈니스 로직 훅 사용
      await deleteReview(reviewId);
      toast.success('리뷰가 삭제되었습니다');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      toast.error('리뷰 삭제 중 오류가 발생했습니다');
      throw error; // 에러 처리 일관성을 위해 throw 추가
    }
  }, [deleteReview]);

  // 본인이 작성한 리뷰인지 확인
  const isMyReview = useCallback((review: Review) => {
    return user?.id === review.userId;
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
    currentPageReviews,
    totalFilteredPages,
    totalReviews,
    isLoading,
    
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
};