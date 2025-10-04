'use client';

import React, { useState, useRef } from 'react';
import { Star, MessageCircle, Filter } from 'lucide-react';
import { Review } from '@/domains/review/types/review';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import { ReviewCard } from '@/domains/review/components/ReviewCard';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { ReviewEditModal } from '@/domains/review/components/ReviewEditModal';
import { useReviews } from '@/domains/review/hooks/useReviewList';

// UI 상수 정의
const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

const SORT_OPTIONS = [
  { value: 'latest' as const, label: '최신순' },
  { value: 'oldest' as const, label: '오래된순' },
  { value: 'highest' as const, label: '평점 높은순' },
  { value: 'lowest' as const, label: '평점 낮은순' }
] as const;

interface ReviewListSectionProps {
  productId: string;
  className?: string;
}

export const ReviewListSection = React.memo<ReviewListSectionProps>(function ReviewListSection({ productId, className = '' }) {
  // UI 상태만 관리
  const [showFilters, setShowFilters] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // 스크롤 처리를 위한 ref
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  // 비즈니스 로직은 훅에서 처리
  const {
    filters,
    currentPageReviews,
    totalFilteredPages,
    totalReviews,
    isLoading,
    queryError,
    handlePageChange,
    handleSaveReview,
    handleDeleteReview,
    handleSortChange,
    handleRatingFilter,
    handleImagesOnlyToggle,
    isMyReview
  } = useReviews({ productId });

  // UI 관련 핸들러들
  const handleEditReview = React.useCallback((review: Review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  }, []);

  const resetEditModalState = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingReview(null);
  }, []);

  const handleSubmit = React.useCallback(async (updatedReview: Review) => {
    await handleSaveReview(updatedReview);
    resetEditModalState();
  }, [handleSaveReview, resetEditModalState]);

  const handleToggleFilters = React.useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // 페이지 변경시 스크롤 처리
  const handlePageChangeWithScroll = React.useCallback((page: number) => {
    handlePageChange(page);
    // 리뷰 섹션으로 부드럽게 스크롤
    reviewSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, [handlePageChange]);

  // 에러 상태
  if (queryError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 ${className}`}>
        <div className="text-center py-8 md:py-12">
          <ErrorMessage
            message="리뷰를 불러오는데 실패했습니다."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (totalReviews === 0 && !isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 ${className}`}>
        <div className="text-center py-8 md:py-12">
          <MessageCircle className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
          <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-1 md:mb-2">아직 리뷰가 없습니다</h3>
          <p className="text-xs md:text-base text-gray-600">이 상품의 첫 번째 리뷰를 작성해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={reviewSectionRef}
      className={`review-section bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* 헤더 */}
      <div className="p-3 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-sm md:text-lg font-semibold text-gray-900">
            리뷰 ({totalReviews})
          </h3>

          <Button
            onClick={handleToggleFilters}
            variant="ghost"
            size="small"
            icon={<Filter className="w-3 h-3 md:w-4 md:h-4" />}
            className="text-xs md:text-sm"
          >
            필터
          </Button>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center space-x-2 md:space-x-4 mb-3 md:mb-4">
          <span className="text-xs md:text-sm text-gray-600">정렬:</span>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {SORT_OPTIONS.map(option => (
              <Button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                variant={filters.sortBy === option.value ? "primary" : "secondary"}
                size="small"
                className="rounded-full text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1"
                noFocus
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 필터 옵션 */}
        {showFilters && (
          <div className="p-2 md:p-4 bg-gray-50 rounded-lg space-y-3 md:space-y-4">
            {/* 별점 필터 */}
            <div>
              <span className="text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 block">별점</span>
              <div className="flex flex-wrap gap-1 md:gap-2">
                <Button
                  onClick={() => handleRatingFilter(null)}
                  variant={filters.selectedRating === null ? "primary" : "secondary"}
                  size="small"
                  className="rounded-full text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1"
                >
                  전체
                </Button>
                {RATING_OPTIONS.map(rating => (
                  <Button
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    variant={filters.selectedRating === rating ? "primary" : "secondary"}
                    size="small"
                    className="rounded-full text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1"
                    icon={<Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            {/* 사진 리뷰만 보기 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showImagesOnly}
                  onChange={(e) => handleImagesOnlyToggle(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-xs md:text-sm text-gray-700">사진 리뷰만 보기</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 리뷰 목록 */}
      <div>
        {currentPageReviews.map((review: Review, index: number) => (
          <div key={review.id}>
              <ReviewCard
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                showEditButton={isMyReview(review)}
                showDeleteButton={isMyReview(review)}
              />
            {/* 마지막 리뷰가 아닌 경우에만 구분선 표시 */}
            {index < currentPageReviews.length - 1 && (
              <div className="border-b border-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="p-3 md:p-6 border-t border-gray-200">
          <LoadingSpinner message="리뷰를 불러오는 중..." />
        </div>
      )}

      {/* 페이지네이션 */}
      {!isLoading && totalFilteredPages > 1 && (
        <div className="p-3 md:p-6 border-t border-gray-200">
          <Pagination
            currentPage={filters.currentPage}
            totalPages={totalFilteredPages}
            onPageChange={handlePageChangeWithScroll}
          />
        </div>
      )}

      {/* 리뷰 수정 모달 */}
      {editingReview && (
        <ReviewEditModal
          isOpen={isEditModalOpen}
          onClose={resetEditModalState}
          review={editingReview}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
});