'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/Button';
import { useReviewWriteSection } from '../hooks/useReviewWriteSection';
import { ReviewFormHeader } from './write-form/ReviewFormHeader';
import { ReviewRatingSection } from './write-form/ReviewRatingSection';
import { ReviewContentSection } from './write-form/ReviewContentSection';
import { ReviewImageUpload } from './write-form/ReviewImageUploadSection';
import { ReviewFormFooter } from './write-form/ReviewFormFooter';

interface ReviewWriteSectionProps {
  productId: string; // 필수로 변경
  className?: string;
  onReviewCreated?: () => void;
}

export const ReviewWriteSection = React.memo<ReviewWriteSectionProps>(function ReviewWriteSection({ productId, className = '', onReviewCreated }) {
  const [isWriting, setIsWriting] = useState(false);

  // 콜백들을 컴포넌트 상단에서 정의
  const handleReviewCreated = React.useCallback(() => {
    setIsWriting(false); // 리뷰 작성 완료 후 UI 상태 초기화
    onReviewCreated?.();
  }, [onReviewCreated]);

  const handleStartWriting = React.useCallback(() => setIsWriting(true), []);
  const handleCancelWriting = React.useCallback(() => setIsWriting(false), []);

  const {
    canWrite,
    formData,
    validationErrors,
    isSubmitting,
    handleRatingChange,
    handleContentChange,
    handleSubmit,
    handleCancel,
    setImageUploadManager,
  } = useReviewWriteSection({
    productId,
    onReviewCreated: handleReviewCreated,
    onCancel: handleCancelWriting
  });

  if (!isWriting) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">리뷰 작성</h3>
          <p className="text-gray-600 mb-4">
            이 상품을 사용해보셨나요? 다른 사용자들에게 도움이 되는 리뷰를 작성해주세요!
          </p>
          <Button
            variant="primary"
            size="medium"
            onClick={handleStartWriting}
            disabled={!canWrite}
          >
            리뷰 작성하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ReviewFormHeader onCancel={handleCancel} />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ReviewRatingSection
            formData={formData}
            validationErrors={validationErrors}
            onRatingChange={handleRatingChange}
          />

          <ReviewContentSection
            formData={formData}
            validationErrors={validationErrors}
            onContentChange={handleContentChange}
          />

          <ReviewImageUpload
            onGetUploadManager={setImageUploadManager}
          />

          <ReviewFormFooter
            isSubmitting={isSubmitting}
            isUploading={false}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
});