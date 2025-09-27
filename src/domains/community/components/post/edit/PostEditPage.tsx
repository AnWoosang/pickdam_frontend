'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/shared/components/Button';
import { PostEditor } from '@/domains/community/components/post/edit/PostEditor';
import { CategorySelector } from '@/domains/community/components/post/CategorySelector';
import { usePostEditPage } from '@/domains/community/hooks/usePostEditPage';

export function PostEditPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id as string;

  const {
    post,
    formData,
    errors,
    isSubmitting,
    isLoading,
    hasChanges,
    updateFormData,
    setErrors,
    handleSubmit: submitForm,
  } = usePostEditPage(postId);

  const handleCancel = () => {
    if (isSubmitting) return;
    router.back();
  };

  if (isLoading) {
    return (
      <div className="py-10 mx-auto">
          <div className="text-center py-20">
            <div className="text-lg text-gray-600">게시글을 불러오는 중...</div>
          </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-10 mx-auto">
          <div className="text-center py-20">
            <div className="text-lg text-gray-600">게시글을 찾을 수 없습니다.</div>
            <Button
              variant="primary"
              onClick={() => router.push('/community')}
              className="mt-4"
            >
              커뮤니티로 돌아가기
            </Button>
          </div>
      </div>
    );
  }

  return (
    <div className="py-10 mx-auto">
      
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">게시글 수정</h1>
          </div>
          <p className="text-gray-600">게시글을 수정해보세요.</p>
        </div>

        <form onSubmit={submitForm} className="space-y-6">
          {/* 카테고리 선택 */}
          <CategorySelector
            value={formData.categoryId || ''}
            onChange={({ categoryId }: { categoryId: string }) => updateFormData({ categoryId })}
            onErrorChange={({ category }: { category?: string }) => category !== undefined && setErrors({ category })}
            error={errors.category}
            allowCurrentNotice={true}
          />

          {/* 제목 및 내용 입력 */}
          <PostEditor
            title={formData.title}
            content={formData.content || ''}
            onChange={updateFormData}
            onErrorChange={(errorUpdates: { title?: string; content?: string }) => setErrors(prev => ({ ...prev, ...errorUpdates }))}
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
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? '수정중...' : '수정완료'}
            </Button>
          </div>
        </form>
    </div>
  );
}