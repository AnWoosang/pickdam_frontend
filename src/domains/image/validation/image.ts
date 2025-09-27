import { ImageContentType, IMAGE_CONFIG } from '../types/Image';

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ImageValidationInput {
  files: File[];
  contentType: ImageContentType;
}

// 허용되는 이미지 형식
const ALLOWED_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png'] as const;
export const ALLOWED_MIME_TYPES = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'] as const;

/**
 * 파일 확장자 추출
 */
const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * 파일 크기를 MB 단위로 변환
 */
const bytesToMB = (bytes: number): number => {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
};

/**
 * 단일 이미지 파일 검증
 */
const validateSingleImage = (file: File, contentType: ImageContentType): string[] => {
  const errors: string[] = [];
  const config = IMAGE_CONFIG[contentType];

  // 확장자 검증
  const extension = getFileExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
    errors.push(`${file.name}: 지원하지 않는 파일 형식입니다. (지원 형식: ${ALLOWED_EXTENSIONS.join(', ')})`);
  }

  // MIME 타입 검증
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    errors.push(`${file.name}: 잘못된 파일 형식입니다.`);
  }

  // 파일 크기 검증 (콘텐츠 타입별)
  const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    const fileSizeMB = bytesToMB(file.size);
    errors.push(`${file.name}: 파일 크기가 너무 큽니다. (${fileSizeMB}MB, 최대 ${config.maxSizeMB}MB)`);
  }

  return errors;
};

/**
 * 이미지 파일들 검증
 */
export const validateImages = (input: ImageValidationInput): ImageValidationResult => {
  const allErrors: string[] = [];
  const config = IMAGE_CONFIG[input.contentType];

  // 파일이 없는 경우
  if (!input.files || input.files.length === 0) {
    allErrors.push('업로드할 이미지를 선택해주세요.');
    return {
      isValid: false,
      errors: allErrors
    };
  }

  // 파일 개수 검증 (콘텐츠 타입별)
  if (input.files.length > config.maxFiles) {
    allErrors.push(`최대 ${config.maxFiles}개의 이미지까지만 업로드할 수 있습니다.`);
  }

  // 각 파일 검증
  for (const file of input.files) {
    const fileErrors = validateSingleImage(file, input.contentType);
    allErrors.push(...fileErrors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};