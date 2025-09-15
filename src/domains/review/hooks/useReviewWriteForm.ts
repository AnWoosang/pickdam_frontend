"use client";

import { useState, useCallback } from 'react';
import { validateReviewForm } from '../validation/reviewValidation';
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

interface UseReviewWriteFormOptions {
  onSubmit?: (formData: ReviewForm) => Promise<void>;
}

export function useReviewWriteForm({ onSubmit }: UseReviewWriteFormOptions) {
  // 폼 데이터 상태 (이미지 URL 제외 - 외부에서 관리)
  const [formData, setFormData] = useState<ReviewForm>(INITIAL_FORM_DATA);
  
  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 폼 제출 핸들러 (순수 비즈니스 로직만)
  const handleSubmit = useCallback(async (imageUrls: string[] = []) => {
    // 검증 실행
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
      return { 
        success: false, 
        errors: validationResult.errors,
        type: 'validation' as const
      };
    }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        // 이미지 URL들을 함께 전달
        const submitData = {
          ...formData,
          uploadedImageUrls: imageUrls
        };
        await onSubmit(submitData);
      }
      
      return { 
        success: true, 
        type: 'submit' as const,
        shouldReset: true,
        shouldClose: true
      };
    } catch (error) {
      return { 
        success: false, 
        error,
        type: 'submit' as const,
        message: error instanceof Error ? error.message : '리뷰 등록에 실패했습니다.'
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  // 폼 리셋 함수
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  return {
    // 폼 데이터
    formData,
    
    // 상태
    isSubmitting,
    
    // 핸들러들
    handleRatingChange,
    handleContentChange,
    handleSubmit,
    resetForm,
  };
}