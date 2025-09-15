'use client';

import React, { useCallback } from 'react';
import { Star, Calendar, Package, Camera } from 'lucide-react';
import { useMyReviewsPage } from '@/domains/user/hooks/mypage/useMyReviewsPage';
import { MypageLayout } from '@/domains/user/components/mypage/MypageLayout';
import { Button } from '@/shared/components/Button';

export function MyReviewsPage() {
  const {
    reviews,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    handleNavigateToProducts,
    handleViewReview
  } = useMyReviewsPage();

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  }, []);
  

  return (
    <MypageLayout
      title="내 리뷰"
      totalCount={totalCount}
      isLoading={isLoading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    >
      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            작성한 리뷰가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            상품을 구매하고 리뷰를 작성해보세요.
          </p>
          <Button
            variant="primary"
            size="large"
            icon={<Package className="w-4 h-4" />}
            onClick={handleNavigateToProducts}
          >
            상품 둘러보기
          </Button>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            {/* 상품 정보 */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="block group">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Package className="w-4 h-4" />
                    <span className="group-hover:text-blue-600 transition-colors truncate">
                      상품 리뷰
                    </span>
                  </div>
                  {/* 브랜드 정보는 Review 타입에 없으므로 삭제 */}
                </div>
                
                {/* 별점 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                </div>
              </div>
            </div>

            {/* 리뷰 내용 */}
            <p className="text-gray-800 mb-4 leading-relaxed">{review.content}</p>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(review.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}</span>
                </div>
                {review.images && review.images.length > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Camera className="w-4 h-4" />
                    <span>사진 포함</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* like_count는 UserReviewItem에 없으므로 삭제 */}
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleViewReview(review)}
                >
                  보기
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </MypageLayout>
  );
}