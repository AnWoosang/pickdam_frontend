"use client";

import { useCallback } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useImageUploadQuery } from './useImageUploadQueries';
import type { Image, ImageUpload, ImageContentType } from '../types/Image';

interface UseImageUploadOptions {
  contentType: ImageContentType;
  onSuccess?: (images: Image[]) => void;
  onError?: (error: string) => void;
}

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    maxSizeKB = 500
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

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

const COMPRESS_OPTIONS: Record<ImageContentType, {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeKB: number;
}> = {
  review: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    maxSizeKB: 300,
  },
  profile: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.9,
    maxSizeKB: 200,
  },
  post: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    maxSizeKB: 500,
  },
  product: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.9,
    maxSizeKB: 800,
  },
};

export function useImageUpload({ 
  contentType, 
  onSuccess, 
  onError 
}: UseImageUploadOptions) {
  const { user } = useAuthUtils();
  const imageUploadMutation = useImageUploadQuery();
  
  const compressOptions = COMPRESS_OPTIONS[contentType];

  const uploadImages = useCallback(async (files: File[]): Promise<Image[]> => {
    if (!user?.id) {
      const error = '로그인이 필요합니다.';
      onError?.(error);
      throw new Error(error);
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    try {
      // Compress images
      const compressedFiles = [];
      for (const file of imageFiles) {
        const compressedFile = await compressImage(file, compressOptions);
        compressedFiles.push(compressedFile);
      }

      const imageUpload: ImageUpload = {
        files: compressedFiles,
        contentType: contentType
      };

      const uploadedImages = await imageUploadMutation.mutateAsync(imageUpload);
      
      onSuccess?.(uploadedImages);
      return uploadedImages;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.';
      onError?.(errorMessage);
      throw error;
    }
  }, [user?.id, contentType, compressOptions, onSuccess, onError, imageUploadMutation]);

  return {
    uploadImages,
    isUploading: imageUploadMutation.isPending,
  };
}