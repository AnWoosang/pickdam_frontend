"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useImageManager } from '@/domains/image/hooks/useImageManager';
import { validateReviewForm } from '@/domains/review/validation/reviewValidation';
import { Review } from '@/domains/review/types/review';
import { IMAGE_STATUS } from '@/domains/image/types/Image';

interface UseReviewEditFormOptions {
  review: Review;
  onError?: (error: string) => void;
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

export function useReviewEditForm({ review }: Omit<UseReviewEditFormOptions, 'onError'>) {
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

  // 원본 데이터 상태 (변경사항 비교용)
  const [originalData, setOriginalData] = useState<ReviewEditFormData>({
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
  const initialImages = useMemo(() =>
    review?.images?.map((img) => ({
      id: `review-${review.id}-img-${img.imageOrder}`,
      url: img.imageUrl,
      fileName: `review-image-${img.imageOrder}`,
      contentType: 'reviews' as const,
      createdAt: new Date(),
    })) || []
  , [review?.id, review?.images]);

  const uploadManager = useImageManager({
    contentType: 'reviews',
    mode: 'edit',
    initialImages,
  });

  // 파일 핸들링
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadManager.addImages(files);
    // input 값 초기화
    if (e.target) {
      e.target.value = '';
    }
  }, [uploadManager]);

  // 리뷰 데이터로 초기화
  useEffect(() => {
    if (review) {
      const initialData = {
        content: review.content || '',
        rating: review.rating || 5,
        sweetness: review.sweetness || 3,
        menthol: review.menthol || 3,
        throatHit: review.throatHit || 3,
        body: review.body || 3,
        freshness: review.freshness || 3,
      };

      setFormData(initialData);
      setOriginalData(initialData);

      // 기존 이미지 초기화는 useImageManager에서 initialImages로 처리
    }
  }, [review]); // review 전체를 의존성으로 설정

  // 필드 변경 핸들러
  const handleFieldChange = useCallback((field: keyof ReviewEditFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 변경사항 확인
  const hasChanges = useMemo(() => {
    const formChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

    // 이미지 변경사항 확인
    const currentImages = uploadManager.imageStates;
    const originalImageCount = initialImages.length;
    const currentImageCount = currentImages.length;

    // 이미지 개수가 다르면 변경됨
    if (originalImageCount !== currentImageCount) {
      return true;
    }

    // 새로운 로컬 이미지가 있으면 변경됨 (상태가 LOCAL인 것들)
    const hasNewLocalImages = currentImages.some(state =>
      state.status === IMAGE_STATUS.LOCAL || !state.uploadedImage
    );

    if (hasNewLocalImages) {
      return true;
    }

    // 기존 이미지 URL 비교
    const currentImageUrls = currentImages
      .filter(state => state.uploadedImage)
      .map(state => state.uploadedImage!.url)
      .sort();
    const originalImageUrls = initialImages
      .map(img => img.url)
      .sort();

    const imagesChanged = JSON.stringify(currentImageUrls) !== JSON.stringify(originalImageUrls);

    return formChanged || imagesChanged;
  }, [formData, originalData, uploadManager.imageStates, initialImages]);

  // 폼 검증
  const validateForm = useCallback(() => {
    return validateReviewForm({
      rating: formData.rating,
      content: formData.content,
      sweetness: formData.sweetness,
      menthol: formData.menthol,
      throatHit: formData.throatHit,
      body: formData.body,
      freshness: formData.freshness
    });
  }, [formData]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async () => {
    const validationResult = validateForm();

    if (!validationResult.isValid) {
      return {
        success: false,
        type: 'validation' as const,
        errors: validationResult.errors
      };
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await uploadManager.commitImages();

      const updateData: Review = {
        id: review.id,
        productId: review.productId,
        memberId: review.memberId,
        nickname: review.nickname,
        profileImageUrl: review.profileImageUrl,
        createdAt: review.createdAt,
        content: formData.content,
        rating: formData.rating,
        sweetness: formData.sweetness,
        menthol: formData.menthol,
        throatHit: formData.throatHit,
        body: formData.body,
        freshness: formData.freshness,
        images: imageUrls.map((url, index) => ({
          imageUrl: url,
          imageOrder: index + 1
        }))
      };

      setIsSubmitting(false);
      return {
        success: true,
        data: updateData
      };
    } catch {
      setIsSubmitting(false);
      return {
        success: false,
        type: 'submit' as const,
        message: '리뷰 수정에 실패했습니다.'
      };
    }
  }, [formData, uploadManager, validateForm, review]);

  return {
    // 폼 데이터
    formData,

    // 상태
    isSubmitting,
    hasChanges,

    // 이미지 관련
    uploadManager,
    handleImageUpload,

    // 핸들러들
    handleFieldChange,
    handleSubmit,
    validateForm,
  };
}