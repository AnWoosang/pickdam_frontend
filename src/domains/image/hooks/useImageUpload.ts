"use client";

import { useCallback } from 'react';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { useImageUploadQuery } from './useImageUploadQueries';
import { compressImage } from '@/utils/imageCompression';
import type { Image } from '../types/Image';
import type { ImageContentType } from '../types/Image';

interface UseImageUploadOptions {
  contentType: ImageContentType;
  onSuccess?: (images: Image[]) => void;
  onError?: (error: string) => void;
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
  const { user } = useAuthStore();
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

      const uploadedImages = await imageUploadMutation.mutateAsync({
        files: compressedFiles,
        type: contentType
      });
      
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