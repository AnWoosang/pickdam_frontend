'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useImageUpload } from './useImageUpload';
import type { Image, ImageState, ImageContentType } from '../types/Image';
import { IMAGE_STATUS } from '../types/Image';

interface ImageManagerOptions {
  contentType: ImageContentType;
  mode?: 'create' | 'edit';
  initialImages?: Image[];
  onError?: (error: string) => void;
}

export function useImageManager({
  contentType,
  mode = 'create',
  initialImages = [],
}: Omit<ImageManagerOptions, 'onError'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageStates, setImageStates] = useState<ImageState[]>([]);

  const { uploadImages } = useImageUpload({ contentType });

  // 초기 이미지 설정 (edit 모드에서 사용)
  const initializeImages = useCallback((images: Image[]) => {
    const states: ImageState[] = images.map((image) => ({
      id: crypto.randomUUID(),
      previewUrl: image.url,
      status: IMAGE_STATUS.UPLOADED,
      uploadedImage: image,
    }));
    setImageStates(states);
  }, []);

  // 초기 이미지가 있는 경우 설정
  useEffect(() => {
    if (mode === 'edit' && initialImages.length > 0) {
      initializeImages(initialImages);
    }
  }, [mode, initialImages, initializeImages]);

  // 파생 상태들
  const activeImages = useMemo(() =>
    imageStates.filter(state => state.status !== IMAGE_STATUS.DELETED),
    [imageStates]
  );

  const { isUploading } = useImageUpload({ contentType });

  // 이미지 추가
  const addImages = useCallback((files: File[]) => {
    // 새 이미지 상태 생성
    const newStates: ImageState[] = files.map((file) => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
      status: IMAGE_STATUS.LOCAL,
      file,
    }));

    setImageStates(prev => [...prev, ...newStates]);
  }, []);

  // 이미지 제거
  const removeImage = useCallback((id: string) => {
    setImageStates(prev => {
      return prev.map(state => {
        if (state.id === id) {
          // blob URL 정리
          if (state.status === IMAGE_STATUS.LOCAL && state.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(state.previewUrl);
          }
          return { ...state, status: IMAGE_STATUS.DELETED };
        }
        return state;
      });
    });
  }, []);

  // 삭제된 이미지 복원 (edit 모드에서 유용)
  const restoreImage = useCallback((id: string) => {
    setImageStates(prev =>
      prev.map(state =>
        state.id === id && state.status === IMAGE_STATUS.DELETED
          ? { ...state, status: state.uploadedImage ? IMAGE_STATUS.UPLOADED : IMAGE_STATUS.LOCAL }
          : state
      )
    );
  }, []);

  // 최종 업로드 및 URL 반환
  const commitImages = useCallback(async (): Promise<string[]> => {
    // 현재 활성 이미지들 (삭제되지 않은 것들)
    const currentActiveImages = imageStates.filter(state => state.status !== IMAGE_STATUS.DELETED);

    // 로컬 이미지들만 업로드
    const localImages = currentActiveImages.filter(state => state.status === IMAGE_STATUS.LOCAL && state.file);

    if (localImages.length > 0) {
      // 파일들 업로드
      const filesToUpload = localImages.map(state => state.file!);
      const uploadedImages = await uploadImages(filesToUpload);

      // 업로드 완료 상태로 업데이트
      setImageStates(prev =>
        prev.map(state => {
          const localIndex = localImages.findIndex(local => local.id === state.id);
          if (localIndex !== -1) {
            return {
              ...state,
              status: IMAGE_STATUS.UPLOADED,
              uploadedImage: uploadedImages[localIndex],
            };
          }
          return state;
        })
      );

      // 새로 업로드된 이미지들의 URL 반환
      const newUploadedUrls = uploadedImages.map(img => img.url);

      // 기존에 업로드된 이미지들의 URL도 포함
      const existingUploadedUrls = currentActiveImages
        .filter(state => state.status === IMAGE_STATUS.UPLOADED && state.uploadedImage)
        .map(state => state.uploadedImage!.url);

      const allUrls = [...existingUploadedUrls, ...newUploadedUrls];
      return allUrls;
    }

    // 로컬 이미지가 없는 경우 기존 업로드된 이미지들만 반환
    const existingUrls = currentActiveImages
      .filter(state => state.status === IMAGE_STATUS.UPLOADED && state.uploadedImage)
      .map(state => state.uploadedImage!.url);
    return existingUrls;
  }, [imageStates, uploadImages]);

  // 초기화
  const resetImages = useCallback(() => {
    // 현재 상태 기준으로 blob URL 정리
    setImageStates(prevStates => {
      prevStates.forEach(state => {
        if (state.status === IMAGE_STATUS.LOCAL && state.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.previewUrl);
        }
      });

      if (mode === 'edit' && initialImages.length > 0) {
        return initialImages.map((image) => ({
          id: crypto.randomUUID(),
          previewUrl: image.url,
          status: IMAGE_STATUS.UPLOADED,
          uploadedImage: image,
        }));
      } else {
        return [];
      }
    });
  }, [mode, initialImages]);

  // 메모리 정리
  const cleanup = useCallback(() => {
    setImageStates(prevStates => {
      prevStates.forEach(state => {
        if (state.status === IMAGE_STATUS.LOCAL && state.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.previewUrl);
        }
      });
      return prevStates;
    });
  }, []);

  // 파일 선택 트리거
  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    // 상태
    fileInputRef,
    imageStates: activeImages, // 삭제되지 않은 이미지들만 반환
    isUploading,

    // 액션
    addImages,
    removeImage,
    restoreImage,
    commitImages,
    resetImages,
    triggerFileSelect,
    cleanup,
  };
}

