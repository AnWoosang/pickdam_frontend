export interface ReviewValidationErrors {
  rating?: string;
  content?: string;
  sweetness?: string;
  menthol?: string;
  throatHit?: string;
  body?: string;
  freshness?: string;
}

export interface ReviewValidationResult {
  isValid: boolean;
  errors: ReviewValidationErrors;
}

export interface ReviewFormData {
  rating: number;
  content: string;
  sweetness: number;
  menthol: number;
  throatHit: number;
  body: number;
  freshness: number;
}

export function validateReviewForm(formData: ReviewFormData): ReviewValidationResult {
  const errors: ReviewValidationErrors = {};

  // 전체 평점 검증
  if (formData.rating === 0) {
    errors.rating = '전체 평점을 선택해주세요.';
  }

  // 리뷰 내용 검증
  if (formData.content.trim().length < 10) {
    errors.content = '리뷰 내용을 10자 이상 작성해주세요.';
  } else if (formData.content.trim().length > 1000) {
    errors.content = '리뷰 내용은 1000자를 초과할 수 없습니다.';
  }

  // 상세 평가 검증 (모든 항목이 필수)
  if (formData.sweetness === 0) {
    errors.sweetness = '달콤함 평점을 선택해주세요.';
  }

  if (formData.menthol === 0) {
    errors.menthol = '멘솔감 평점을 선택해주세요.';
  }

  if (formData.throatHit === 0) {
    errors.throatHit = '목넘김 평점을 선택해주세요.';
  }

  if (formData.body === 0) {
    errors.body = '바디감 평점을 선택해주세요.';
  }

  if (formData.freshness === 0) {
    errors.freshness = '신선함 평점을 선택해주세요.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors
  };
}

export function getValidationErrorMessage(errors: ReviewValidationErrors): string {
  const errorMessages = Object.values(errors).filter(Boolean);
  return errorMessages.join('\n');
}