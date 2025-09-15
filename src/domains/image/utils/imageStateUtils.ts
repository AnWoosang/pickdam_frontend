import type { Image, ImageUploadState } from '../types/Image';
import type { ImageContentType } from '../types/Image';

/**
 * Image 객체로부터 ImageUploadState 생성
 */
export function createUploadStateFromImage(image: Image): ImageUploadState {
  return {
    id: image.id,
    file: new File([], image.fileName, { type: image.mimeType || 'image/jpeg' }),
    previewUrl: image.url,
    progress: 100,
    status: 'success',
    result: image
  };
}

/**
 * 레거시 URL 문자열로부터 ImageUploadState 생성
 */
export function createUploadStateFromUrl(
  url: string, 
  index: number, 
  contentType: ImageContentType, 
  userId: string
): ImageUploadState {
  const fileName = `legacy-image-${index + 1}`;
  
  return {
    id: crypto.randomUUID(),
    file: new File([], fileName, { type: 'image/jpeg' }),
    previewUrl: url,
    progress: 100,
    status: 'success',
    result: {
      id: crypto.randomUUID(),
      url,
      fileName,
      filePath: url,
      contentType,
      userId,
      createdAt: new Date(),
      isPreview: false
    }
  };
}

/**
 * 새 파일로부터 pending 상태의 ImageUploadState 생성
 */
export function createPendingUploadState(file: File): ImageUploadState {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    progress: 0,
    status: 'pending'
  };
}

/**
 * 클립보드 이미지 파일명 생성
 */
export function generateClipboardFileName(fileType: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
  const extension = fileType.split('/')[1];
  return `clipboard-image-${timestamp}.${extension}`;
}