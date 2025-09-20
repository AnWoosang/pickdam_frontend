"use client";

import { useCallback } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useCreateReview } from './useReviewQueries';
import type { ReviewForm } from '../types/review';

interface UseReviewWriteSectionOptions {
  productId: string; // 필수로 변경
  onReviewCreated?: () => void;
}

export function useReviewWriteSection({ 
  productId, 
  onReviewCreated 
}: UseReviewWriteSectionOptions) {
  const { user } = useAuthUtils();
  const createReviewMutation = useCreateReview();

  const submitReview = useCallback(async (formData: ReviewForm) => {
    if (!user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        memberId: user.id,
        reviewForm: formData
      });

      onReviewCreated?.();
    } catch (error) {
      throw error; // 사용하는 쪽에서 에러 처리
    }
  }, [user?.id, productId, createReviewMutation, onReviewCreated]);

  return {
    isSubmitting: createReviewMutation.isPending,
    
    submitReview,
    
    canWrite: !!user?.id, // productId는 이제 필수이므로 검사 불필요
  };
}