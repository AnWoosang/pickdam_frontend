"use client";

import { Post } from '@/domains/community/types/community';
import { useUpdatePostMutation } from '@/domains/community/hooks/usePostQueries';
import { DEFAULT_CATEGORY_ID } from '@/domains/community/types/community';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { User } from '@/domains/user/types/user';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';

interface UsePostHeaderProps {
  post: Post;
  user: User | null;
  onPostDelete?: () => void;
}

export const usePostHeader = ({ post, user, onPostDelete }: UsePostHeaderProps) => {
  // 뮤테이션
  const updatePostMutation = useUpdatePostMutation();
  
  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );
  
  // 작성자 확인
  const isOwner = user && (user.id === post.authorId);

  // 편집 저장 핸들러
  const handleSaveEdit = useCallback((updatedData: { title: string; content: string }, onSuccess?: () => void) => {
    if (!user) {
      const authError = createBusinessError.unauthorized('로그인이 필요합니다.');
      toast.error(authError.message);
      return;
    }

    updatePostMutation.mutate({
      id: post.id,
      form: {
        title: updatedData.title,
        content: updatedData.content,
        categoryId: post.category?.id || DEFAULT_CATEGORY_ID,
        authorId: user.id
      }
    }, {
      onSuccess: () => {
        toast.success('게시글이 수정되었습니다.');
        onSuccess?.();
      },
      onError: (error) => {
        const processedError = createErrorHandler('게시글 수정에 실패했습니다.')(error);
        console.error('PostHeader mutation error:', processedError);
        toast.error(processedError.message);
      }
    });
  }, [user, post.id, post.category?.id, updatePostMutation, createErrorHandler]);

  // 삭제 확인 핸들러
  const handleConfirmDelete = useCallback(() => {
    onPostDelete?.();
  }, [onPostDelete]);

  // 공유 핸들러
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = post?.title || '게시글';

    // Web Share API 사용 가능한 경우
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // 사용자가 취소한 경우 아무것도 하지 않음
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        // 공유 실패 시 클립보드로 대체
        const shareError = createErrorHandler('공유에 실패했습니다.')(error);
        console.error('Share failed:', shareError);
      }
    }

    // 클립보드 복사
    try {
      await navigator.clipboard.writeText(url);
      toast.success('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      const clipboardError = createErrorHandler('클립보드 복사에 실패했습니다.')(error);
      console.error('Clipboard copy failed:', clipboardError);
      // 클립보드 실패 시 수동 복사
      prompt('다음 링크를 복사하세요:', url);
    }
  }, [post?.title, createErrorHandler]);

  return {
    // 상태
    isOwner,
    
    // 뮤테이션 상태
    isSubmitting: updatePostMutation.isPending,
    
    // 핸들러
    handleSaveEdit,
    handleConfirmDelete,
    handleShare,
  };
};