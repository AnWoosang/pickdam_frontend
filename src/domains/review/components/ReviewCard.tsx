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
import { formatAbsoluteDate } from '@/shared/utils/Format';

// 상수 정의
const RATING_STARS = [1, 2, 3, 4, 5] as const;

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

export const ReviewCard = React.memo<ReviewCardProps>(function ReviewCard({
  review,
  onEdit,
  onDelete,
  showEditButton = false,
  showDeleteButton = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);
  const imageViewer = useImageViewer();

  // 컨텐츠가 4줄을 넘는지 확인
  React.useEffect(() => {
    if (contentRef.current && !isExpanded) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 4; // 4줄 높이
      const isOverflowing = contentRef.current.scrollHeight > maxHeight;
      setShouldShowExpandButton(isOverflowing);
    }
  }, [review.content, isExpanded]);

  const displayContent = review.content;


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
    return hasImages ? review.images!.map((img) => img.imageUrl) : [];
  }, [review.images]);

  const handleImageClick = React.useCallback((index: number) => {
    if (imageUrls.length > 0) {
      imageViewer.openViewer(imageUrls, index);
    }
  }, [imageUrls, imageViewer]);

  return (
    <div className="bg-white rounded-lg p-4 min-h-[150px]">
      {/* 사용자 정보 및 평점 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            src={review.profileImageUrl}
            alt={review.nickname}
            size="medium"
          />
          <div>
            <h4 className="font-medium text-gray-900">{review.nickname}</h4>
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
                {formatAbsoluteDate(review.createdAt)}
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


      {/* 리뷰 내용 */}
      <div className="mb-4">
        <p
          ref={contentRef}
          className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${
            !isExpanded ? 'line-clamp-4' : ''
          }`}
        >
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
        <div className="flex gap-2 flex-wrap">
          {review.images!.filter(image => image.imageUrl && image.imageUrl.trim() !== '').slice(0, 4).map((image, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.imageUrl}
                alt={`리뷰 이미지 ${index + 1}`}
                fill
                sizes="80px"
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
        message={`이 리뷰를 삭제하시겠습니까?\n삭제된 리뷰는 복구할 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
});