'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter, Calendar, User, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { Review } from '@/types/product';

interface ReviewListSectionProps {
  reviews: Review[];
  productId?: string;
  className?: string;
}

type SortOption = 'latest' | 'oldest' | 'highest' | 'lowest' | 'helpful';

export function ReviewListSection({ reviews, productId, className = '' }: ReviewListSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showImagesOnly, setShowImagesOnly] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // 리뷰 정렬
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        // 임시로 최신 순으로 정렬 (실제로는 도움도 기준)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // 필터 적용
  const filteredReviews = sortedReviews.filter(review => {
    if (selectedRating && review.rating !== selectedRating) return false;
    if (showImagesOnly && (!review.imageUrls || review.imageUrls.length === 0)) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleExpandReview = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'highest', label: '평점 높은순' },
    { value: 'lowest', label: '평점 낮은순' },
    { value: 'helpful', label: '도움순' }
  ];

  if (reviews.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 리뷰가 없습니다</h3>
          <p className="text-gray-600">이 상품의 첫 번째 리뷰를 작성해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            리뷰 ({filteredReviews.length})
          </h3>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>필터</span>
          </button>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm text-gray-600">정렬:</span>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-3 py-1 text-sm rounded-full ${
                  sortBy === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 필터 옵션 */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            {/* 별점 필터 */}
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">별점</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRating(null)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedRating === null
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  전체
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-full ${
                      selectedRating === rating
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* 사진 리뷰만 보기 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showImagesOnly}
                  onChange={(e) => setShowImagesOnly(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">사진 리뷰만 보기</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 리뷰 목록 */}
      <div className="divide-y divide-gray-200">
        {filteredReviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldShowExpandButton = review.content.length > 200;
          const displayContent = shouldShowExpandButton && !isExpanded 
            ? review.content.slice(0, 200) + '...' 
            : review.content;

          return (
            <div key={review.id} className="p-6">
              {/* 리뷰 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">{review.userName}</div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* 별점 */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {review.rating}
                  </span>
                </div>
              </div>

              {/* 리뷰 이미지 */}
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="mb-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {review.imageUrls.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 리뷰 내용 */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {displayContent}
                </p>
                
                {shouldShowExpandButton && (
                  <button
                    onClick={() => toggleExpandReview(review.id)}
                    className="flex items-center space-x-1 text-primary text-sm mt-2 transition-colors"
                  >
                    <span>{isExpanded ? '접기' : '더 보기'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>

              {/* 리뷰 액션 */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">도움돼요</span>
                </button>
                
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">{review.imageUrls.length}장</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기 버튼 (페이지네이션용) */}
      {filteredReviews.length < reviews.length && (
        <div className="p-6 border-t border-gray-200 text-center">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg transition-colors">
            리뷰 더보기
          </button>
        </div>
      )}
    </div>
  );
}