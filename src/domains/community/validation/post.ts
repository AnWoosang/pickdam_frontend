import { isValidCategoryId } from '@/domains/community/types/community';
// import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

export interface PostValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    content?: string;
    category?: string;
  };
}

export interface PostValidationInput {
  title: string;
  content: string;
  categoryId: string;
}

// 유효성 검증 상수
const VALIDATION_LIMITS = {
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 100,
  CONTENT_MIN_LENGTH: 10,
  CONTENT_MAX_LENGTH: 10000,
} as const;

/**
 * HTML 콘텐츠에서 실제 텍스트 길이를 안전하게 계산
 */
const getActualTextLength = (content: string): number => {
  // SSR 환경에서는 간단한 텍스트 추출
  if (typeof window === 'undefined') {
    return content.replace(/<[^>]*>/g, '').trim().length;
  }

  // Data URL과 이미지 URL을 플레이스홀더로 대체
  const contentForValidation = content
    .replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '[이미지]')
    .replace(/https?:\/\/[^\s"'>]+\.(jpg|jpeg|png|gif|webp)/gi, '[이미지]');
  
  // DOMParser를 사용한 안전한 HTML 파싱 (XSS 방지)
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentForValidation, 'text/html');
  
  // 스크립트 태그 제거 (보안)
  doc.querySelectorAll('script').forEach(el => el.remove());
  
  return doc.body.textContent?.trim().length || 0;
};

export const validatePost = (input: PostValidationInput): PostValidationResult => {
  const errors: { title?: string; content?: string; category?: string } = {};

  if (!input.title || !input.title.trim()) {
    errors.title = '제목을 입력해주세요.';
  } else if (input.title.trim().length < VALIDATION_LIMITS.TITLE_MIN_LENGTH) {
    errors.title = `제목은 ${VALIDATION_LIMITS.TITLE_MIN_LENGTH}자 이상 입력해주세요.`;
  } else if (input.title.trim().length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
    errors.title = `제목은 ${VALIDATION_LIMITS.TITLE_MAX_LENGTH}자 이하로 입력해주세요.`;
  }

  // 내용 검증
  if (!input.content || !input.content.trim()) {
    errors.content = '내용을 입력해주세요.';
  } else {
    const actualTextLength = getActualTextLength(input.content);
    
    if (actualTextLength < VALIDATION_LIMITS.CONTENT_MIN_LENGTH) {
      errors.content = `내용은 ${VALIDATION_LIMITS.CONTENT_MIN_LENGTH}자 이상 입력해주세요.`;
    } else if (actualTextLength > VALIDATION_LIMITS.CONTENT_MAX_LENGTH) {
      errors.content = `내용은 ${VALIDATION_LIMITS.CONTENT_MAX_LENGTH}자 이하로 입력해주세요.`;
    }
  }

  // 카테고리 검증
  if (!input.categoryId || !isValidCategoryId(input.categoryId)) {
    errors.category = '유효한 카테고리를 선택해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};