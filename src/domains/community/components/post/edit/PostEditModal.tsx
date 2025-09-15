'use client';

import { Post } from '@/domains/community/types/community';
import { PostEditor } from '@/domains/community/components/post/edit/PostEditor';
import { usePostEditModal } from '@/domains/community/hooks/usePostEditModal';
import { CategorySelector } from '@/domains/community/components/post/CategorySelector';

import React from 'react';
import { Edit3 } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { BaseModal } from '@/shared/components/BaseModal';

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onSave: (updatedData: { title: string; content: string; images?: File[] }) => void;
  isSubmitting?: boolean;
}

export function PostEditModal({
  isOpen,
  onClose,
  post,
  onSave,
  isSubmitting = false
}: PostEditModalProps) {
  const {
    formData,
    errors,
    imageEditor,
    updateFormData,
    setFormErrors,
    handleSubmit: submitForm,
  } = usePostEditModal({
    post,
    isOpen,
    onSave,
  });


  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  // PostEditor에서 사용할 콜백
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      size="large"
      title="게시글 수정"
      icon={<Edit3 className="w-5 h-5 text-primary" />}
      footer={
        <div className="flex justify-end gap-3 p-6">
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
            form="edit-post-form"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '수정중...' : '수정완료'}
          </Button>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <form id="edit-post-form" onSubmit={submitForm} className="space-y-6 p-6">
          {/* 카테고리 선택 */}
          <CategorySelector
            value={formData.categoryId || ''}
            onChange={({ categoryId }: { categoryId: string }) => updateFormData({ categoryId })}
            onErrorChange={({ category }: { category?: string }) => category !== undefined && setFormErrors({ category })}
            error={errors.category}
          />

          {/* 제목 및 내용 입력 */}
          <PostEditor
            title={formData.title}
            content={formData.content || ''}
            onChange={updateFormData}
            onErrorChange={(errorUpdates: { title?: string; content?: string }) => setFormErrors(errorUpdates)}
            titleError={errors.title}
            contentError={errors.content}
            imageEditor={imageEditor}
          />
        </form>
      </div>
    </BaseModal>
  );
}