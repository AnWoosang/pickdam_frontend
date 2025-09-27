'use client';

import { useCallback } from 'react';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useImageUploadQuery } from './useImageUploadQueries';
import { useUIStore } from '@/domains/auth/store/authStore';
import { validateImages } from '../validation/image';
import { compressImage } from '../utils/compression';
import type { Image, ImageUpload, ImageContentType } from '../types/Image';

interface UseImageUploadOptions {
  contentType: ImageContentType;
}

/**
 * 이미지 업로드 훅 - 압축, 검증, 업로드를 담당
 */
export function useImageUpload({ contentType }: UseImageUploadOptions) {
  const { user } = useAuthUtils();
  const { showToast } = useUIStore();
  const imageUploadMutation = useImageUploadQuery();

  const uploadImages = useCallback(async (files: File[]): Promise<Image[]> => {
    if (!user?.id) {
      showToast('로그인이 필요합니다.', 'error');
      return [];
    }

    // 이미지 파일 검증
    const validationResult = validateImages({ files, contentType });
    if (!validationResult.isValid) {
      showToast(validationResult.errors[0], 'error');
      return [];
    }

    // 이미지 압축
    const compressedFiles = await Promise.all(
      files.map(file => compressImage(file, contentType))
    );

    const imageUpload: ImageUpload = {
      files: compressedFiles,
      contentType
    };

    // 업로드 실행
    return new Promise((resolve, reject) => {
      imageUploadMutation.mutate(imageUpload, {
        onSuccess: (uploadedImages) => {
          showToast('이미지 업로드에 성공했습니다.', 'success');
          resolve(uploadedImages);
        },
        onError: (error) => {
          showToast('이미지 업로드에 실패했습니다.', 'error');
          reject(error);
        }
      });
    });
  }, [user?.id, contentType, imageUploadMutation, showToast]);

  return {
    uploadImages,
    isUploading: imageUploadMutation.isPending,
  };
}