// 이미지 MIME 타입 정의
export const ALLOWED_IMAGE_MIME_TYPES = [
  // JPEG
  'image/jpeg',
  'image/jpg',
  
  // PNG
  'image/png',
  
  // WebP (현대적, 압축률 좋음)
  'image/webp',
  
  // GIF (애니메이션 포함)
  'image/gif'
] as const;

// 확장자 기반 검증용
export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg', 
  '.png',
  '.webp',
  '.gif'
] as const;

// 파일 크기 제한
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_REVIEW_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB