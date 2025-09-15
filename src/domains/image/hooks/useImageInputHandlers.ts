"use client";

import { useState, useCallback } from 'react';

interface UseImageInputHandlersOptions {
  maxImages: number;
  currentImageCount: number;
  onAddImages: (
    files: File[], 
    params?: { 
      textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
      content?: string;
      onContentChange?: (content: string) => void;
    }
  ) => void;
  onError?: (error: string) => void;
}

// 상수 정의
const SUPPORTED_IMAGE_PREFIX = 'image/';
const ERROR_MESSAGES = {
  NO_IMAGE_FILES: '이미지 파일만 업로드할 수 있습니다.',
  EXCEED_MAX_IMAGES: (max: number) => `이미지는 최대 ${max}장까지 첨부할 수 있습니다.`,
} as const;

// 유틸리티 함수들
const isImageFile = (file: File | DataTransferItem): boolean => {
  return file.type.startsWith(SUPPORTED_IMAGE_PREFIX);
};

const filterImageFiles = (files: File[]): File[] => {
  return files.filter(isImageFile);
};

const generateClipboardFileName = (fileType: string): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
  const extension = fileType.split('/')[1] || 'png';
  return `clipboard-image-${timestamp}.${extension}`;
};

const createFileFromClipboardItem = (item: DataTransferItem): File | null => {
  const file = item.getAsFile();
  if (!file) return null;
  
  const fileName = generateClipboardFileName(file.type);
  return new File([file], fileName, { type: file.type });
};

const validateImageCount = (currentCount: number, newCount: number, maxCount: number): boolean => {
  return currentCount + newCount <= maxCount;
};

export function useImageInputHandlers({ 
  maxImages, 
  currentImageCount, 
  onAddImages, 
  onError 
}: UseImageInputHandlersOptions) {
  const [isDragOver, setIsDragOver] = useState(false);

  const processImageFiles = useCallback((
    imageFiles: File[], 
    params?: { 
      textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
      content?: string;
      onContentChange?: (content: string) => void;
    }
  ) => {
    if (imageFiles.length === 0) {
      onError?.(ERROR_MESSAGES.NO_IMAGE_FILES);
      return;
    }

    if (!validateImageCount(currentImageCount, imageFiles.length, maxImages)) {
      onError?.(ERROR_MESSAGES.EXCEED_MAX_IMAGES(maxImages));
      return;
    }

    onAddImages(imageFiles, params);
  }, [currentImageCount, maxImages, onAddImages, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  // 파일 선택 핸들러
  const handleImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    params?: { 
      textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
      content?: string;
      onContentChange?: (content: string) => void;
    }
  ) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = filterImageFiles(files);
    
    processImageFiles(imageFiles, params);
    
    if (e.target) {
      e.target.value = '';
    }
  }, [processImageFiles]);

  const handleDrop = useCallback((
    e: React.DragEvent,
    params?: { 
      textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
      content?: string;
      onContentChange?: (content: string) => void;
    }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = filterImageFiles(files);
    
    processImageFiles(imageFiles, params);
  }, [processImageFiles]);

  const handlePaste = useCallback((
    e: React.ClipboardEvent,
    params?: { 
      textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
      content?: string;
      onContentChange?: (content: string) => void;
    }
  ) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (isImageFile(item)) {
        const file = createFileFromClipboardItem(item);
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length === 0) return;
    
    e.preventDefault();
    processImageFiles(imageFiles, params);
  }, [processImageFiles]);

  return {
    isDragOver,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
  };
}

// 하위 호환성을 위한 별칭
export const useImageDragDrop = useImageInputHandlers;