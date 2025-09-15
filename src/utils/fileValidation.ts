import { ALLOWED_IMAGE_MIME_TYPES, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE } from '@/shared/constants/mimeTypes';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageFile(file: File, maxSize: number = MAX_IMAGE_SIZE): FileValidationResult {
  // MIME 타입 검증
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
    return {
      isValid: false,
      error: `지원하지 않는 파일 형식입니다. (${file.type})\n지원 형식: JPG, PNG, WebP, GIF`
    };
  }
  
  // 파일 크기 검증
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / 1024 / 1024);
    const fileSizeMB = Math.round(file.size / 1024 / 1024 * 10) / 10;
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. (${fileSizeMB}MB)\n최대 크기: ${maxSizeMB}MB`
    };
  }
  
  // 확장자 이중 검증 (보안)
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension as typeof ALLOWED_IMAGE_EXTENSIONS[number])) {
    return {
      isValid: false,
      error: `지원하지 않는 파일 확장자입니다. (${extension})`
    };
  }
  
  return { isValid: true };
}

// 다중 파일 검증
export function validateImageFiles(files: File[], maxSize: number = MAX_IMAGE_SIZE): FileValidationResult {
  for (const file of files) {
    const result = validateImageFile(file, maxSize);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
}