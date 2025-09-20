"use client";

import { useState, useRef, useCallback, useMemo } from 'react';
import { useImageUpload } from './useImageUpload';
import type { ImageUploadState, ImageContentType } from '../types/Image';
import { IMAGE_LIMITS } from '../types/Image';

interface NewImageManagerOptions {
  contentType: ImageContentType;
  onUploadError?: (error: string) => void;
}

export function useNewImageManager({ 
  contentType, 
  onUploadError
}: NewImageManagerOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStates, setUploadStates] = useState<ImageUploadState[]>([]);
  
  const { uploadImages } = useImageUpload({
    contentType,
    onSuccess: () => {},
    onError: (error) => {
      onUploadError?.(error);
    },
  });

  const maxImages = IMAGE_LIMITS[contentType];
  
  // Derived state
  const imagePreviewUrls = useMemo(() => uploadStates.map(state => state.previewUrl), [uploadStates]);

  const imageUrls = useMemo(() => 
    uploadStates
      .filter(state => state.result)
      .map(state => state.result!.url), 
    [uploadStates]
  );

  const images = useMemo(() => 
    uploadStates
      .filter(state => state.result)
      .map(state => state.result!), 
    [uploadStates]
  );
  
  const isUploading = useMemo(() =>
    uploadStates.some(state => state.status === 'uploading'),
    [uploadStates]
  );

  // 이미지 추가
  const addImages = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (uploadStates.length + imageFiles.length > maxImages) {
      onUploadError?.(`이미지는 최대 ${maxImages}장까지 첨부할 수 있습니다.`);
      return;
    }

    const newUploadStates: ImageUploadState[] = imageFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }));
    
    setUploadStates(prev => [...prev, ...newUploadStates]);
  }, [uploadStates.length, maxImages, onUploadError]);

  // 최종 제출 시 pending 상태의 파일들을 실제 업로드
  const commitUploads = useCallback(async () => {
    const pendingStates = uploadStates.filter(state => state.status === 'pending');
    if (pendingStates.length === 0) return [];

    // pending → uploading 상태로 변경
    setUploadStates(prev =>
      prev.map(state =>
        pendingStates.some(p => p.id === state.id)
          ? { ...state, status: 'uploading' as const, progress: 0 }
          : state
      )
    );

    try {
      const filesToUpload = pendingStates.map(state => state.file);
      const uploadedImages = await uploadImages(filesToUpload);

      // uploading → success 상태 업데이트
      setUploadStates(prev =>
        prev.map(state => {
          const pendingIndex = pendingStates.findIndex(p => p.id === state.id);
          if (pendingIndex !== -1) {
            return {
              ...state,
              status: 'success' as const,
              result: uploadedImages[pendingIndex],
              progress: 100
            };
          }
          return state;
        })
      );

      return uploadedImages;
    } catch (error) {
      // uploading → error 상태 업데이트
      setUploadStates(prev =>
        prev.map(state =>
          pendingStates.some(p => p.id === state.id)
            ? { ...state, status: 'error' as const, error: error instanceof Error ? error.message : '업로드 실패' }
            : state
        )
      );

      throw error;
    }
  }, [uploadStates, uploadImages]);

  // 이미지 제거
  const removeImage = useCallback((index: number) => {
    const stateToRemove = uploadStates[index];
    if (!stateToRemove) return;
    
    // blob URL 메모리 정리
    if (stateToRemove.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(stateToRemove.previewUrl);
    }
    
    setUploadStates(prev => prev.filter((_, i) => i !== index));
  }, [uploadStates]);

  const resetImages = useCallback(() => {
    // 모든 blob URL 메모리 정리
    uploadStates.forEach(state => {
      if (state.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.previewUrl);
      }
    });
    
    setUploadStates([]);
  }, [uploadStates]);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return {
    // 상태 및 데이터
    fileInputRef,
    images,
    imageUrls,
    imagePreviewUrls,
    uploadStates,
    isUploading,
    maxImages,
    
    // 주요 액션들
    addImages,
    commitUploads,
    removeImage,
    triggerImageUpload,
    resetImages,
  };
}