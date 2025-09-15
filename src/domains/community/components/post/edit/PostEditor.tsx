"use client";

import React, { useRef, useState, useCallback } from 'react';
import { ImageIcon } from 'lucide-react';
import { useQuill } from '@/domains/community/hooks/useQuill';
import {UnifiedImageState} from '@/domains/image/types/Image';

// Constants
const TITLE_MAX_LENGTH = 99;
const EDITOR_MIN_HEIGHT = 300;
const IMAGE_INSERT_DELAY = 100;

// Types
interface ImageEditorType {
  addNewImages: (files: File[]) => Promise<void>;
  activeImages: UnifiedImageState[];
  parseExistingImages?: (content: string) => void;
}

interface PostEditorProps {
  title: string;
  content: string;
  onChange: (updates: { title?: string; content?: string }) => void;
  onErrorChange: (errors: { title?: string; content?: string }) => void;
  titleError?: string;
  contentError?: string;
  imageEditor: ImageEditorType;
}

export function PostEditor({
  title,
  content,
  onChange,
  onErrorChange,
  titleError,
  contentError,
  imageEditor,
}: PostEditorProps) {
  // Quill CSS는 글로벌 CSS에서 처리

  // UI 상태
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTitleChange = (newTitle: string) => {
    onChange({ title: newTitle });
    if (titleError) {
      onErrorChange({ title: undefined });
    }
  };

  const handleContentChange = (newContent: string) => {
    onChange({ content: newContent });
    if (contentError) {
      onErrorChange({ content: undefined });
    }
  };

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Use Quill hook
  const { quillRef, textLength, insertImage } = useQuill({
    content,
    onChange: handleContentChange,
    onImageButtonClick: handleImageButtonClick
  });
  
  // 드래그 앤 드롭 핸들러들
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  }, [isDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  }, []);

  // 이미지 추가를 위한 핸들러
  const handleAddImages = useCallback(async (files: File[]) => {
    // Processing image files
    
    try {
      // imageEditor를 통해 이미지 추가
      await imageEditor.addNewImages(files);
      
      // Data URL들을 Quill에 삽입
      const newImages = imageEditor.activeImages.slice(-files.length);
      
      // Use Promise chain instead of setTimeout to avoid race conditions
      newImages.reduce((promise, img: UnifiedImageState) => {
        return promise.then(() => {
          insertImage(img.previewUrl);
          return new Promise(resolve => setTimeout(resolve, IMAGE_INSERT_DELAY));
        });
      }, Promise.resolve());
    } catch (error) {
      console.error('Image conversion failed:', error);
    }
    
    setIsDragOver(false);
  }, [insertImage, imageEditor]);

  return (
    <div className="space-y-6">
      {/* 제목 입력 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="게시글 제목을 입력하세요"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            titleError ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={TITLE_MAX_LENGTH}
        />
        <div className="flex justify-between items-center text-sm mt-1">
          {titleError ? (
            <p className="text-red-500">{titleError}</p>
          ) : (
            <div />
          )}
          <span className="text-gray-500">{title.length}/{TITLE_MAX_LENGTH}</span>
        </div>
      </div>

      {/* 내용 입력 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용 <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="space-y-4">
          {/* Quill 에디터 */}
          <div 
            className={`relative ${isDragOver ? 'ring-2 ring-primary ring-opacity-50' : ''} ${
              contentError ? 'ring-2 ring-red-500' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files);
              handleAddImages(files);
            }}
          >
            {/* Quill이 여기에 마운트됩니다 */}
            <div ref={quillRef} className={`min-h-[${EDITOR_MIN_HEIGHT}px]`} />
            {isDragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg border-2 border-dashed border-primary pointer-events-none z-10">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-primary font-medium">이미지를 여기에 드롭하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm mt-1">
          {contentError ? (
            <p className="text-red-500">{contentError}</p>
          ) : (
            <div />
          )}
          <span className="text-gray-500">{textLength}자</span>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            handleAddImages(files);
          }
          // 입력 초기화
          if (e.target) {
            e.target.value = '';
          }
        }}
        className="hidden"
      />
    </div>
  );
}