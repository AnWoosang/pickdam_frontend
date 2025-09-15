/**
 * 이미지 압축 및 리사이징 유틸리티
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 ~ 1.0
  maxSizeKB?: number; // 최대 파일 크기 (KB)
}

export async function compressImage(
  file: File, 
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeKB = 500 // 500KB 제한
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 원본 크기 계산
      let { width, height } = img;
      
      // 비율 유지하면서 크기 조정
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

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // 품질 조정하며 압축
      let currentQuality = quality;
      const tryCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // 파일 크기 확인
          const sizeKB = blob.size / 1024;
          
          if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
            // 목표 크기 달성하거나 최소 품질에 도달
            const compressedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            // 품질을 낮춰서 다시 시도
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