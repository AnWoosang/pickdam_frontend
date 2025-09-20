"use client";

import { useState, useRef, useCallback, useMemo } from 'react';
import { useImageUpload } from './useImageUpload';
import type { Image, ImageContentType, UnifiedImageState } from '../types/Image';
import { IMAGE_LIMITS } from '../types/Image';

interface ImageModifyManagerOptions {
  contentType: ImageContentType;
  onUploadError?: (error: string) => void;
}

export function useImageModifyManager({ 
  contentType, 
  onUploadError
}: ImageModifyManagerOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 통일된 이미지 상태 관리
  const [imageStates, setImageStates] = useState<UnifiedImageState[]>([]);
  
  const maxImages = IMAGE_LIMITS[contentType];

  // 실제 이미지 업로드 훅 사용
  const { uploadImages } = useImageUpload({
    contentType,
    onError: onUploadError,
  });

  // 기존 이미지 초기화
  const initializeExistingImages = useCallback((images: Image[]) => {
    const states: UnifiedImageState[] = images.map(image => ({
      id: crypto.randomUUID(),
      previewUrl: image.url,
      isExisting: true,
      serverId: image.id,
      isDeleted: false,
    }));
    setImageStates(states);
  }, []);

  // 새 이미지 추가
  const addImages = useCallback((files: File[]) => {
    const newStates: UnifiedImageState[] = files.map(file => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
      file,
      isDeleted: false,
    }));

    setImageStates(prev => {
      const currentCount = prev.filter(state => !state.isDeleted).length;
      const availableSlots = maxImages - currentCount;
      const statesToAdd = newStates.slice(0, availableSlots);
      
      if (statesToAdd.length < newStates.length) {
        onUploadError?.(`최대 ${maxImages}개까지만 업로드 가능합니다.`);
      }
      
      return [...prev, ...statesToAdd];
    });
  }, [maxImages, onUploadError]);

  // 이미지 삭제 및 복원 (소프트 삭제 방식)
  const removeImage = useCallback((id: string) => {
    setImageStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, isDeleted: true }
          : state
      )
    );
  }, []);

  const restoreImage = useCallback((id: string) => {
    setImageStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, isDeleted: false }
          : state
      )
    );
  }, []);

  // 파생된 상태들
  const activeImages = useMemo(() => 
    imageStates.filter(state => !state.isDeleted),
    [imageStates]
  );

  const allImagePreviewUrls = useMemo(() => 
    activeImages.map(state => state.previewUrl),
    [activeImages]
  );

  // 업로드 상태 추가
  const [uploadingImageIds, setUploadingImageIds] = useState<Set<string>>(new Set());

  const isUploading = useMemo(() =>
    uploadingImageIds.size > 0,
    [uploadingImageIds]
  );
  
  const currentImageCount = activeImages.length;

  // 메모리 정리 유틸리티 함수
  const cleanupBlobUrls = useCallback((states: UnifiedImageState[]) => {
    states.forEach(state => {
      if (state.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.previewUrl);
      }
    });
  }, []);

  // 새 이미지 업로드 처리 - useImageUpload 사용
  const uploadNewImages = useCallback(async () => {
    const newImages = activeImages.filter(state => !state.isExisting && state.file);
    const filesToUpload = newImages.map(state => state.file!);

    if (filesToUpload.length === 0) return [];

    // 업로드 시작 시 상태 설정
    const imageIds = new Set(newImages.map(state => state.id));
    setUploadingImageIds(imageIds);

    try {
      const result = await uploadImages(filesToUpload);
      return result;
    } finally {
      // 업로드 완료 시 상태 클리어
      setUploadingImageIds(new Set());
    }
  }, [activeImages, uploadImages]);

  // 최종 제출용 이미지 URL 목록 생성
  const getFinalImageUrls = useCallback(async () => {
    const existingImages = activeImages.filter(state => state.isExisting);
    
    // 1. 기존 이미지 URL들
    const existingImageUrls = existingImages.map(state => state.previewUrl);
    
    // 2. 새 이미지들을 실제 업로드
    const uploadedImages = await uploadNewImages();
    const newImageUrls = uploadedImages
      .filter((img): img is Image => Boolean(img))
      .map(img => img.url);
    
    return [...existingImageUrls, ...newImageUrls];
  }, [activeImages, uploadNewImages]);

  // 새 이미지만 리셋 (수정 화면에서 사용)
  const resetNewImages = useCallback(() => {
    const newImageStates = imageStates.filter(state => !state.isExisting);
    cleanupBlobUrls(newImageStates);
    
    // 기존 이미지만 남기고 새 이미지 제거
    setImageStates(prev => prev.filter(state => state.isExisting));
  }, [imageStates, cleanupBlobUrls]);

  // 메모리 정리용 (화면 닫기 시 사용)
  const cleanup = useCallback(() => {
    cleanupBlobUrls(imageStates);
  }, [imageStates, cleanupBlobUrls]);

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return {
    // 상태 및 데이터
    fileInputRef,
    imageStates,
    activeImages,
    allImagePreviewUrls,
    currentImageCount,
    isUploading,
    maxImages,
    
    // 이미지 관리
    initializeExistingImages,
    addImages,
    removeImage,
    restoreImage,
    
    // 최종 제출
    getFinalImageUrls,
    
    // 정리
    resetNewImages,
    cleanup,
    triggerImageUpload,
  };
}