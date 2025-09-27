import { ImageContentType, IMAGE_CONFIG } from '../types/Image';

interface CompressOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeKB: number;
}

/**
 * 이미지 압축 유틸리티
 */
export async function compressImage(
  file: File,
  contentType: ImageContentType
): Promise<File> {
  const options = IMAGE_CONFIG[contentType].compressOptions;
  return compressImageWithOptions(file, options);
}

/**
 * 커스텀 옵션으로 이미지 압축
 */
export async function compressImageWithOptions(
  file: File,
  options: CompressOptions
): Promise<File> {
  const { maxWidth, maxHeight, quality, maxSizeKB } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // 크기 조정
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 품질 조정을 통한 압축
      let currentQuality = quality;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const sizeKB = blob.size / 1024;

          if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
            const compressedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            currentQuality -= 0.1;
            tryCompress();
          }
        }, file.type, currentQuality);
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}