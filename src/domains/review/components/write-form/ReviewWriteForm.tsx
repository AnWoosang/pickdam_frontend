'use client';

import React, { useState } from 'react';
import { useReviewWriteForm } from '@/domains/review/hooks/useReviewWriteForm';
import { ReviewForm } from '@/domains/review/types/review';
import { getValidationErrorMessage, type ReviewValidationErrors } from '@/domains/review/validation/reviewValidation';
import { toast } from 'react-hot-toast';
import { ReviewFormHeader } from '@/domains/review/components/write-form/ReviewFormHeader';
import { ReviewRatingSection } from '@/domains/review/components/write-form/ReviewRatingSection';
import { ReviewContentSection } from '@/domains/review/components/write-form/ReviewContentSection';
import { ReviewImageUpload } from '@/domains/review/components/write-form/ReviewImageUploadSection'
import { ReviewFormFooter } from '@/domains/review/components/write-form/ReviewFormFooter';
import { Image } from '@/domains/image/types/Image';

interface ImageUploadManager {
  commitUploads: () => Promise<Image[]>;
  resetImages: () => void;
  isUploading: boolean;
}

// 에러 메시지 상수
const ERROR_MESSAGES = {
  UPLOAD_ERROR: '이미지 업로드 중 오류가 발생했습니다',
  SUBMIT_ERROR: '리뷰 등록 중 오류가 발생했습니다',
  VALIDATION_ERROR: '필수 항목을 확인해주세요',
  REGISTRATION_ERROR: '리뷰 등록에 실패했습니다',
  SUCCESS_MESSAGE: '리뷰가 등록되었습니다!'
} as const;

interface ReviewWriteFormProps {
  onCancel: () => void;
  onSubmit?: (formData: ReviewForm) => Promise<void>;
}

export const ReviewWriteForm = React.memo(function ReviewWriteForm({ onCancel, onSubmit }: ReviewWriteFormProps) {

  // UI 상태만 컴포넌트에서 관리
  const [validationErrors, setValidationErrors] = useState<ReviewValidationErrors>({});
  const [imageUploadManager, setImageUploadManager] = useState<ImageUploadManager | null>(null);

  // 비즈니스 로직은 훅에서 관리
  const {
    formData,
    isSubmitting,
    handleRatingChange,
    handleContentChange,
    handleSubmit: submitForm,
    resetForm,
  } = useReviewWriteForm({
    onSubmit,
  });

  // 이미지 업로드 핸들러
  const handleImageUpload = React.useCallback(async (): Promise<string[]> => {
    console.log('📷 [ReviewWriteForm] 이미지 업로드 시작:', {
      hasImageUploadManager: !!imageUploadManager,
      isUploading: imageUploadManager?.isUploading
    });

    if (!imageUploadManager) {
      console.log('⚠️ [ReviewWriteForm] imageUploadManager가 없음');
      return [];
    }

    try {
      const uploadedImages = await imageUploadManager.commitUploads();
      console.log('✅ [ReviewWriteForm] 이미지 업로드 성공:', {
        count: uploadedImages.length,
        images: uploadedImages.map(img => ({ url: img.url }))
      });
      return uploadedImages.map(img => img.url);
    } catch (_error: unknown) {
      console.error('❌ [ReviewWriteForm] 이미지 업로드 실패:', _error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  }, [imageUploadManager]);

  // 검증 에러 처리
  const handleValidationError = React.useCallback((errors: ReviewValidationErrors) => {
    setValidationErrors(errors);
    const errorMessage = getValidationErrorMessage(errors);
    toast.error(errorMessage || ERROR_MESSAGES.VALIDATION_ERROR);
  }, []);

  // 제출 에러 처리
  const handleSubmitError = React.useCallback((message: string) => {
    toast.error(message || ERROR_MESSAGES.REGISTRATION_ERROR);
  }, []);

  // 성공 처리
  const handleSuccess = React.useCallback((result: { shouldReset?: boolean; shouldClose?: boolean }) => {
    setValidationErrors({});
    
    if (result.shouldReset) {
      resetForm();
      imageUploadManager?.resetImages();
    }
    
    if (result.shouldClose) {
      onCancel();
    }
    
    // 성공 메시지 표시 (onSubmit 없는 경우에만)
    if (!onSubmit) {
      toast.success(ERROR_MESSAGES.SUCCESS_MESSAGE);
    }
  }, [resetForm, imageUploadManager, onCancel, onSubmit]);

  // 취소 핸들러
  const handleCancel = React.useCallback(() => {
    imageUploadManager?.resetImages();
    onCancel();
  }, [imageUploadManager, onCancel]);

  // 폼 제출 핸들러 (UI 책임 처리)
  const handleSubmit = React.useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const imageUrls = await handleImageUpload();
      const result = await submitForm(imageUrls);

      if (!result.success) {
        if (result.type === 'validation' && result.errors) {
          handleValidationError(result.errors);
        } else if (result.type === 'submit' && result.message) {
          handleSubmitError(result.message);
        }
      } else if (result.success) {
        handleSuccess(result);
      }
    } catch (_error: unknown) {
      toast.error('리뷰 작성에 실패했습니다.');
    }
  }, [handleImageUpload, submitForm, handleValidationError, handleSubmitError, handleSuccess]);

  // 이미지 업로드 에러 핸들러
  const handleImageUploadError = React.useCallback((error: string) => {
    toast.error(error || '이미지 업로드에 실패했습니다.');
  }, []);


  return (
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
          onUploadError={handleImageUploadError}
          onGetUploadManager={setImageUploadManager}
        />

        <ReviewFormFooter
          isSubmitting={isSubmitting}
          isUploading={imageUploadManager?.isUploading || false}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
});