"use client";

import { useState, useCallback, useMemo } from 'react';
import { useImageUploadQuery } from '@/domains/image/hooks/useImageUploadQueries';
import { convertFilesToDataUrls, replaceDataUrlsWithServerUrls, parseImagesFromHtml } from '@/domains/community/utils/imageUtils';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';
import type { UnifiedImageState, Image, ImageUploadState } from '@/domains/image/types/Image';

// 이미지 에디터 인터페이스
interface PostImageEditor {
  // 상태
  imageStates: UnifiedImageState[];
  activeImages: UnifiedImageState[];
  isUploading: boolean;
  dataUrlToFileMap: Map<string, File>;
  
  // 기본 기능
  addNewImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  restoreImage: (id: string) => void;
  resetImages: () => void;
  
  // 업로드 기능
  uploadNewImages: () => Promise<Image[]>;
  replaceDataUrlsWithServerUrls: (content: string, uploadedImages: Image[]) => string;
  
  // 기존 이미지 기능 (supportExistingImages가 true일 때만)
  parseExistingImages?: (content: string) => void;
  
  // 호환성 (기존 ImageUploadManager 인터페이스)
  commitUploads: () => Promise<Image[]>;
  uploadStates: ImageUploadState[];
}

interface UsePostImageEditorOptions {
  supportExistingImages?: boolean;
  onUploadError?: (error: BusinessError) => void;
}

export const usePostImageEditor = ({
  supportExistingImages = false,
  onUploadError
}: UsePostImageEditorOptions = {}): PostImageEditor => {
  // 상태 관리
  const [imageStates, setImageStates] = useState<UnifiedImageState[]>([]);
  const [dataUrlToFileMap, setDataUrlToFileMap] = useState<Map<string, File>>(new Map());
  
  // React Query 이미지 업로드 뮤테이션
  const uploadMutation = useImageUploadQuery();
  
  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );
  
  // 파생된 상태들
  const activeImages = useMemo(() => 
    imageStates.filter(state => !state.isDeleted),
    [imageStates]
  );

  const isUploading = useMemo(() => 
    activeImages.some(state => !state.isExisting && state.file),
    [activeImages]
  );

  // Data URL과 파일 매핑 추가
  const addFileToDataUrlMap = useCallback((dataUrl: string, file: File) => {
    setDataUrlToFileMap(prev => new Map(prev.set(dataUrl, file)));
  }, []);

  // 새 이미지 추가
  const addNewImages = useCallback(async (files: File[]) => {
    try {
      const dataUrls = await convertFilesToDataUrls(files, (dataUrl, file) => {
        addFileToDataUrlMap(dataUrl, file);
      });

      const newStates: UnifiedImageState[] = dataUrls.map((dataUrl, index) => ({
        id: crypto.randomUUID(),
        previewUrl: dataUrl,
        isExisting: false,
        file: files[index],
        isDeleted: false,
      }));

      setImageStates(prev => [...prev, ...newStates]);
    } catch (error) {
      const processedError = createErrorHandler('이미지 추가에 실패했습니다.')(error);
      console.error('Add new images failed:', processedError);
      onUploadError?.(processedError);
    }
  }, [addFileToDataUrlMap, onUploadError, createErrorHandler]);

  // 이미지 소프트 삭제
  const removeImage = useCallback((id: string) => {
    setImageStates(prev => 
      prev.map(state => 
        state.id === id ? { ...state, isDeleted: true } : state
      )
    );
  }, []);

  // 이미지 복원
  const restoreImage = useCallback((id: string) => {
    setImageStates(prev => 
      prev.map(state => 
        state.id === id ? { ...state, isDeleted: false } : state
      )
    );
  }, []);

  // 새 이미지들 업로드
  const uploadNewImages = useCallback(async (): Promise<Image[]> => {
    const newImages = activeImages.filter(state => !state.isExisting && state.file);
    const filesToUpload = newImages.map(state => state.file!);
    
    if (filesToUpload.length === 0) {
      return [];
    }

    try {
      const results = await uploadMutation.mutateAsync({
        files: filesToUpload,
        type: 'post'
      });
      
      return results;
    } catch (error) {
      const processedError = createErrorHandler('이미지 업로드에 실패했습니다.')(error);
      console.error('Upload new images failed:', processedError);
      onUploadError?.(processedError);
      throw processedError;
    }
  }, [activeImages, uploadMutation, onUploadError, createErrorHandler]);

  // Data URL을 서버 URL로 교체
  const replaceDataUrlsWithServerUrlsLocal = useCallback((
    content: string,
    uploadedImages: Image[]
  ): string => {
    return replaceDataUrlsWithServerUrls(content, dataUrlToFileMap, uploadedImages);
  }, [dataUrlToFileMap]);

  // 기존 이미지 파싱 (supportExistingImages가 true일 때만)
  const parseExistingImages = useCallback((content: string) => {
    if (!supportExistingImages) {
      console.warn('parseExistingImages called but supportExistingImages is false');
      return;
    }

    const parsedImages = parseImagesFromHtml(content);
    
    const existingImageStates: UnifiedImageState[] = parsedImages.map(img => ({
      id: img.id,
      previewUrl: img.src,
      isExisting: true,
      serverId: img.serverId,
      isDeleted: false,
    }));
    
    setImageStates(existingImageStates);
  }, [supportExistingImages]);

  // 이미지 상태 초기화
  const resetImages = useCallback(() => {
    setImageStates([]);
    setDataUrlToFileMap(new Map());
  }, []);

  // 호환성을 위한 uploadStates
  const uploadStates = useMemo(() => 
    activeImages
      .filter(state => state.file) // file이 있는 것만 필터링
      .map(state => ({
        id: state.id,
        file: state.file!,
        previewUrl: state.previewUrl,
        status: 'success' as const,
        progress: 100
      })),
    [activeImages]
  );

  return {
    // 상태
    imageStates,
    activeImages,
    isUploading,
    dataUrlToFileMap,
    
    // 기본 기능
    addNewImages,
    removeImage,
    restoreImage,
    resetImages,
    
    // 업로드 기능
    uploadNewImages,
    replaceDataUrlsWithServerUrls: replaceDataUrlsWithServerUrlsLocal,
    
    // 기존 이미지 기능 (조건부)
    ...(supportExistingImages && { parseExistingImages }),
    
    // 호환성 (기존 ImageUploadManager 인터페이스)
    commitUploads: uploadNewImages,
    uploadStates,
  };
};