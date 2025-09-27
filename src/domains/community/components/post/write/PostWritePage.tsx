'use client';

import React from 'react';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useWritePostPage } from '@/domains/community/hooks/usePostWritePage';
import { CategorySelector } from '@/domains/community/components/post/CategorySelector';
import { PostEditor } from '@/domains/community/components/post/edit/PostEditor';

export function PostWritePage() {
  const {
    formData,
    errors,
    isSubmitting,
    showCancelDialog,
    updateFormData,
    setErrors,
    handleCancel,
    handleSubmit,
    handleConfirmCancel,
    handleCloseCancelDialog,
  } = useWritePostPage();

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

        {/* 취소 확인 다이얼로그 */}
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClose={handleCloseCancelDialog}
          onConfirm={handleConfirmCancel}
          message="작성 중인 내용이 있습니다. 정말 취소하시겠습니까?"
          confirmText="취소"
          cancelText="계속 작성"
        />
    </div>
  );
}