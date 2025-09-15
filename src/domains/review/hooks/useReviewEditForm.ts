"use client";

import { useState, useCallback, useEffect } from 'react';
import { useImageModifyManager } from '@/domains/image/hooks/useImageModifyManager';
import { useImageInputHandlers } from '@/domains/image/hooks/useImageInputHandlers';
import { Review } from '@/domains/review/types/review';

interface UseReviewEditFormOptions {
  review: Review;
  onSubmit?: (updatedReview: Partial<Review>) => Promise<void>;
  onError?: (error: unknown) => void;
}

interface ReviewEditFormData {
  content: string;
  rating: number;
  sweetness: number;
  menthol: number;
  throatHit: number;
  body: number;
  freshness: number;
}

// 기본값 상수
const DEFAULT_RATING = 5;
const DEFAULT_DETAIL_RATING = 3;

export function useReviewEditForm({ review, onSubmit, onError }: UseReviewEditFormOptions) {
  // 폼 데이터 상태
  const [formData, setFormData] = useState<ReviewEditFormData>({
    content: '',
    rating: DEFAULT_RATING,
    sweetness: DEFAULT_DETAIL_RATING,
    menthol: DEFAULT_DETAIL_RATING,
    throatHit: DEFAULT_DETAIL_RATING,
    body: DEFAULT_DETAIL_RATING,
    freshness: DEFAULT_DETAIL_RATING,
  });

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 업로드 관리
  const uploadManager = useImageModifyManager({
    contentType: 'review'
  });

  // 파일 핸들링
  const fileHandlers = useImageInputHandlers({
    maxImages: uploadManager.maxImages,
    currentImageCount: uploadManager.currentImageCount,
    onAddImages: (files: File[]) => uploadManager.addImages(files),
    onError: (error: string) => onError?.(new Error(error)),
  });

  // 리뷰 데이터로 초기화
  useEffect(() => {
    if (review) {
      setFormData({
        content: review.content || '',
        rating: review.rating || 5,
        sweetness: review.sweetness || 3,
        menthol: review.menthol || 3,
        throatHit: review.throatHit || 3,
        body: review.body || 3,
        freshness: review.freshness || 3,
      });
      // 기존 이미지 초기화
      if (review.images && review.images.length > 0) {
        const existingImages = review.images.map((img) => ({
          id: `review-${review.id}-img-${img.order}`, // ReviewImage.order 사용
          url: img.url,
          fileName: `review-image-${img.order}`,
          filePath: img.url,
          contentType: 'review' as const,
          createdAt: new Date(),
          isPreview: false
        }));
        uploadManager.initializeExistingImages(existingImages);
      }
    }
  }, [review, uploadManager]);

  // 필드 변경 핸들러
  const handleFieldChange = useCallback((field: keyof ReviewEditFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 폼 검증
  const validateForm = useCallback(() => {
    if (!formData.content.trim()) {
      return {
        isValid: false,
        errors: { content: '리뷰 내용을 입력해주세요.' }
      };
    }
    if (formData.content.trim().length < 10) {
      return {
        isValid: false,
        errors: { content: '리뷰는 최소 10자 이상 입력해주세요.' }
      };
    }
    return { isValid: true, errors: {} };
  }, [formData.content]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async () => {
    const validationResult = validateForm();
    
    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        type: 'validation' as const
      };
    }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit({
          content: formData.content,
          rating: formData.rating,
          sweetness: formData.sweetness,
          menthol: formData.menthol,
          throatHit: formData.throatHit,
          body: formData.body,
          freshness: formData.freshness,
          images: (await uploadManager.getFinalImageUrls()).map((url, index) => ({
            url,
            order: index + 1
          }))
        });
      }
      
      return {
        success: true,
        type: 'submit' as const,
        shouldClose: true
      };
    } catch (error) {
      return {
        success: false,
        error,
        type: 'submit' as const,
        message: error instanceof Error ? error.message : '리뷰 수정에 실패했습니다.'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, uploadManager, onSubmit, validateForm]);

  return {
    // 폼 데이터
    formData,
    
    // 상태
    isSubmitting,
    
    // 이미지 관련
    uploadManager,
    fileHandlers,
    
    // 핸들러들
    handleFieldChange,
    handleSubmit,
    validateForm,
  };
}