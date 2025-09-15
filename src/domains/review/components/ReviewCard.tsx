'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { Review } from '@/domains/review/types/review';
import { useImageViewer } from '@/domains/image/hooks/useImageViewer';
import { ImageViewerModal } from '@/shared/components/ImageViewerModal';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

// 상수 정의
const RATING_STARS = [1, 2, 3, 4, 5] as const;
const CONTENT_PREVIEW_LENGTH = 200;

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  formatDate?: (dateString: string) => string;
}

export const ReviewCard = React.memo<ReviewCardProps>(function ReviewCard({
  review,
  onEdit,
  onDelete,
  showEditButton = false,
  showDeleteButton = false,
  formatDate
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const imageViewer = useImageViewer();

  const shouldShowExpandButton = review.content.length > CONTENT_PREVIEW_LENGTH;
  const displayContent = shouldShowExpandButton && !isExpanded 
    ? review.content.slice(0, CONTENT_PREVIEW_LENGTH) + '...' 
    : review.content;

  const defaultFormatDate = React.useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatDateFn = formatDate || defaultFormatDate;

  const handleEditClick = React.useCallback(() => {
    if (onEdit) {
      onEdit(review);
    }
  }, [onEdit, review]);

  const handleDeleteClick = React.useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = React.useCallback(() => {
    if (onDelete) {
      onDelete(review.id);
    }
    setShowDeleteConfirm(false);
  }, [onDelete, review.id]);

  const handleDeleteCancel = React.useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const toggleExpand = React.useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // 이미지 관련
  const imageUrls = React.useMemo(() => {
    const hasImages = review.images && review.images.length > 0;
    return hasImages ? review.images!.map((img) => img.url) : [];
  }, [review.images]);

  const handleImageClick = React.useCallback((index: number) => {
    if (imageUrls.length > 0) {
      imageViewer.openViewer(imageUrls, index);
    }
  }, [imageUrls, imageViewer]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      {/* 사용자 정보 및 평점 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={review.profileImage}
            alt={review.userName}
            size="medium"
          />
          <div>
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {RATING_STARS.map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {formatDateFn(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        {/* 수정/삭제 버튼 */}
        {(showEditButton || showDeleteButton) && (
          <div className="flex space-x-2">
            {showEditButton && (
              <Button
                variant="ghost"
                size="small"
                onClick={handleEditClick}
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            {showDeleteButton && (
              <Button
                variant="ghost"
                size="small"
                onClick={handleDeleteClick}
                className="text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 세부 평점 */}
      <div className="grid grid-cols-5 gap-4 mb-4 text-sm">
        <div className="text-center">
          <div className="text-gray-500">달콤함</div>
          <div className="font-medium">{review.sweetness}/5</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">멘솔</div>
          <div className="font-medium">{review.menthol}/5</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">목넘김</div>
          <div className="font-medium">{review.throatHit}/5</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">바디감</div>
          <div className="font-medium">{review.body}/5</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">신선함</div>
          <div className="font-medium">{review.freshness}/5</div>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        {shouldShowExpandButton && (
          <Button
            variant="ghost"
            size="small"
            onClick={toggleExpand}
            className="mt-2 text-primary hover:text-primary-dark"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                접기
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                더보기
              </>
            )}
          </Button>
        )}
      </div>

      {/* 이미지 */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {review.images!.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.url}
                alt={`리뷰 이미지 ${index + 1}`}
                fill
                className="object-cover"
              />
              {review.images!.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium">
                    +{review.images!.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 이미지 뷰어 모달 */}
      <ImageViewerModal 
        isOpen={imageViewer.isOpen}
        images={imageViewer.images}
        currentIndex={imageViewer.currentIndex}
        onClose={imageViewer.closeViewer}
        onIndexChange={imageViewer.goToImage}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        confirmButtonColor="red"
      />
    </div>
  );
});