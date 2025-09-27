"use client";

import { useState, useCallback } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useCreateReview } from './useReviewQueries';
import { validateReviewForm, type ReviewValidationErrors } from '../validation/reviewValidation';
import type { ReviewForm } from '../types/review';

// 초기값 상수
const DEFAULT_RATING = 5;
const DEFAULT_DETAIL_RATING = 3;

const INITIAL_FORM_DATA: ReviewForm = {
  rating: DEFAULT_RATING,
  content: '',
  sweetness: DEFAULT_DETAIL_RATING,
  menthol: DEFAULT_DETAIL_RATING,
  throatHit: DEFAULT_DETAIL_RATING,
  body: DEFAULT_DETAIL_RATING,
  freshness: DEFAULT_DETAIL_RATING,
  uploadedImageUrls: [],
};

interface UseReviewWriteSectionOptions {
  productId: string;
  onReviewCreated?: () => void;
  onCancel?: () => void;
}

export function useReviewWriteSection({
  productId,
  onReviewCreated,
  onCancel
}: UseReviewWriteSectionOptions) {
  const { user } = useAuthUtils();
  const { showToast } = useUIStore();
  const createReviewMutation = useCreateReview();

  // 폼 상태 관리
  const [formData, setFormData] = useState<ReviewForm>(INITIAL_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState<ReviewValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadManager, setImageUploadManager] = useState<{
    commitUploads: () => Promise<string[]>;
    resetImages: () => void;
    isUploading: boolean;
  } | null>(null);

  // 평점 변경 핸들러
  const handleRatingChange = useCallback((field: keyof ReviewForm, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }));
  }, []);

  // 내용 변경 핸들러
  const handleContentChange = useCallback((content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (): Promise<string[]> => {
    if (!imageUploadManager) {
      return [];
    }
    const urls = await imageUploadManager.commitUploads();
    return urls;
  }, [imageUploadManager]);

  // 검증 에러 처리
  const handleValidationError = useCallback((errors: ReviewValidationErrors) => {
    setValidationErrors(errors);
  }, []);

  // 폼 리셋 함수
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setValidationErrors({});
  }, []);

  // 성공 처리
  const handleSuccess = useCallback((result: { shouldReset?: boolean; shouldClose?: boolean }) => {
    setValidationErrors({});

    if (result.shouldReset) {
      resetForm();
      imageUploadManager?.resetImages();
    }

    if (result.shouldClose) {
      onCancel?.();
    }

    // 성공 메시지는 submitReview에서 처리
  }, [resetForm, imageUploadManager, onCancel]);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    imageUploadManager?.resetImages();
    onCancel?.();
  }, [imageUploadManager, onCancel]);

  // 리뷰 제출 로직
  const submitReview = useCallback(async (reviewData: ReviewForm) => {
    return new Promise<void>((resolve, reject) => {
      createReviewMutation.mutate({
        productId,
        memberId: user!.id,
        reviewForm: reviewData
      }, {
        onSuccess: () => {
          showToast('리뷰가 등록되었습니다.', 'success');
          onReviewCreated?.();
          resolve();
        },
        onError: (error) => {
          showToast('리뷰 등록에 실패했습니다.', 'error');
          reject(error);
        }
      });
    });
  }, [user, productId, createReviewMutation, onReviewCreated, showToast]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    event?.preventDefault();
    setIsSubmitting(true);

    const imageUrls = await handleImageUpload();

    const validationResult = validateReviewForm({
      rating: formData.rating,
      content: formData.content,
      sweetness: formData.sweetness,
      menthol: formData.menthol,
      throatHit: formData.throatHit,
      body: formData.body,
      freshness: formData.freshness
    });

    if (!validationResult.isValid) {
      handleValidationError(validationResult.errors);
      setIsSubmitting(false);
      return;
    }

    const reviewData = {
      ...formData,
      uploadedImageUrls: imageUrls
    };

    await submitReview(reviewData);
    handleSuccess({ shouldReset: true, shouldClose: true });
    setIsSubmitting(false);
  }, [formData, handleImageUpload, submitReview, handleValidationError, handleSuccess]);

  return {
    // 기존 반환값
    canWrite: !!user?.id,

    // 폼 상태
    formData,
    validationErrors,
    isSubmitting,

    // 핸들러들
    handleRatingChange,
    handleContentChange,
    handleSubmit,
    handleCancel,
    resetForm,
    setImageUploadManager,
  };
}