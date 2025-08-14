'use client';

import React, { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/common/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { useWritePostForm } from '../../hooks/useWritePostForm';
import { useImageManager } from '../../hooks/useImageManager';
import { CategorySelector } from './CategorySelector';
import { PostEditor } from './PostEditor';
import { ImageGallery } from './ImageGallery';

export function WritePostPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const {
    formData,
    errors,
    isSubmitting,
    updateTitle,
    updateContent,
    updateCategory,
    handleCancel,
    handleSubmit: submitForm,
  } = useWritePostForm();

  const {
    fileInputRef,
    images,
    imagePreviewUrls,
    isDragOver,
    handleImageUpload,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
    cleanupUnusedImages,
    triggerImageUpload,
    insertImageAtCursor,
  } = useImageManager();

  // 콘텐츠 변경을 위한 디바운스된 클린업
  const handleContentChange = useCallback((newContent: string) => {
    updateContent(newContent);
    
    // 1초 후에 사용하지 않는 이미지 정리
    const timeoutId = setTimeout(() => {
      cleanupUnusedImages(newContent);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [updateContent, cleanupUnusedImages]);

  // 이미지 관련 핸들러들을 래핑
  const wrappedHandlers = {
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => 
      handleImageUpload(e, textareaRef, formData.content, updateContent),
    onRemoveImage: (index: number) => 
      removeImage(index, formData.content, updateContent),
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => 
      handleDrop(e, textareaRef, formData.content, updateContent),
    onPaste: (e: React.ClipboardEvent) => 
      handlePaste(e, textareaRef, formData.content, updateContent),
    onImageInsert: (index: number) => 
      insertImageAtCursor(index, textareaRef, formData.content, updateContent),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(images);
  };

  return (
    <MainLayout>
      <div className="py-10 mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">글쓰기</h1>
          <p className="text-gray-600">커뮤니티에 새로운 게시글을 작성해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <CategorySelector
            selectedCategoryId={formData.categoryId}
            onCategoryChange={updateCategory}
            error={errors.category}
          />

          {/* 제목 및 내용 입력 */}
          <PostEditor
            title={formData.title}
            content={formData.content}
            onTitleChange={updateTitle}
            onContentChange={handleContentChange}
            onPaste={wrappedHandlers.onPaste}
            onDragOver={wrappedHandlers.onDragOver}
            onDragLeave={wrappedHandlers.onDragLeave}
            onDrop={wrappedHandlers.onDrop}
            isDragOver={isDragOver}
            isPreviewMode={isPreviewMode}
            onPreviewModeChange={setIsPreviewMode}
            titleError={errors.title}
            contentError={errors.content}
            textareaRef={textareaRef}
          />

          {/* 이미지 첨부 */}
          <ImageGallery
            images={images}
            imagePreviewUrls={imagePreviewUrls}
            fileInputRef={fileInputRef}
            onImageUpload={wrappedHandlers.onImageUpload}
            onRemoveImage={wrappedHandlers.onRemoveImage}
            onImageInsert={wrappedHandlers.onImageInsert}
            onTriggerUpload={triggerImageUpload}
          />

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}