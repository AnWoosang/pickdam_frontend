'use client';

import React from 'react';
import { Button } from '@/shared/components/Button';
import { usePostImageEditor } from '@/domains/community/hooks/usePostImageEditor';
import { useWritePostPage } from '@/domains/community/hooks/usePostWritePage';
import { CategorySelector } from '@/domains/community/components/post/CategorySelector';
import { PostEditor } from '@/domains/community/components/post/edit/PostEditor';
import { Image } from '@/domains/image/types/Image';

export function PostWritePage() {
  // 이미지 에디터 (글쓰기용 - 기존 이미지 지원 없음)
  const imageEditor = usePostImageEditor({
    supportExistingImages: false
  });

  const {
    formData,
    errors,
    isSubmitting,
    updateFormData,
    setErrors,
    handleCancel,
    handleSubmit: submitForm,
  } = useWritePostPage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. 이미지 업로드
      const uploadedImages = await imageEditor.uploadNewImages();
      const imageUrls = uploadedImages.map((img: Image) => img.url);
      
      // 2. Data URL을 서버 URL로 교체
      const updatedContent = imageEditor.replaceDataUrlsWithServerUrls(formData.content, uploadedImages);
      
      // 3. 폼 제출
      await submitForm(imageUrls, {
        ...formData,
        content: updatedContent
      });
    } catch (error) {
      console.error('게시글 등록 실패:', error);
    }
  };

  return (
    <div className="py-10 mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">글쓰기</h1>
          <p className="text-gray-600">커뮤니티에 새로운 게시글을 작성해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <CategorySelector
            value={formData.categoryId}
            onChange={updateFormData}
            onErrorChange={setErrors}
            error={errors.category}
          />

          {/* 제목 및 내용 입력 */}
          <PostEditor
            title={formData.title}
            content={formData.content}
            onChange={updateFormData}
            onErrorChange={setErrors}
            titleError={errors.title}
            contentError={errors.content}
            imageEditor={imageEditor}
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
  );
}