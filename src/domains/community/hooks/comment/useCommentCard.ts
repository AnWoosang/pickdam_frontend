"use client";

import { useCallback, useMemo } from 'react';
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation
} from '@/domains/community/hooks/comment/useCommentQueries';
import { Comment } from '@/domains/community/types/community';
import { BusinessError } from '@/shared/error/BusinessError';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import toast from 'react-hot-toast';

interface UseCommentCardProps {
  comment: Comment;
  postId: string;
  onUpdate: () => void;
}

export const useCommentCard = ({ comment, postId }: UseCommentCardProps) => {
  const { user } = useAuthUtils();

  // React Query Mutations
  const createCommentMutation = useCreateCommentMutation();
  const updateCommentMutation = useUpdateCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();

  // 권한 확인
  const isOwner = useMemo(() => 
    user && (user.id === comment.authorId), 
    [user, comment.authorId]
  );

  // 공통 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown) => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return error;
      return new BusinessError('COMMENT_OPERATION_ERROR', defaultMessage);
    }, 
    []
  );


  const updateComment = useCallback(({
    content,
    onSuccess,
    onError
  }: {
    content: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => {
    updateCommentMutation.mutate({
      commentId: comment.id,
      data: { content, authorId: user!.id }
    }, {
      onSuccess: () => {
        toast.success('댓글이 수정되었습니다.');
        onSuccess?.();
      },
      onError: (error) => {
        onError?.(createErrorHandler('댓글 수정에 실패했습니다.')(error));
      }
    });
  }, [comment.id, user, updateCommentMutation, createErrorHandler]);

  const deleteComment = useCallback(({
    onSuccess,
    onError
  }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => {
    deleteCommentMutation.mutate({
      commentId: comment.id,
      authorId: user!.id
    }, {
      onSuccess: () => {
        toast.success('댓글이 삭제되었습니다.');
        onSuccess?.();
      },
      onError: (error) => {
        onError?.(createErrorHandler('댓글 삭제에 실패했습니다.')(error));
      }
    });
  }, [comment.id, user, deleteCommentMutation, createErrorHandler]);

  const createReply = useCallback(({
    content,
    parentId,
    onSuccess,
    onError
  }: {
    content: string;
    parentId: string;
    onSuccess?: (newReply: Comment) => void;
    onError?: (error: Error) => void;
  }) => {
    const requestData = {
      content,
      postId,
      parentId,
      authorId: user!.id
    };

    createCommentMutation.mutate(requestData, {
      onSuccess: (newReply) => {
        onSuccess?.(newReply);
      },
      onError: (error) => {
        onError?.(createErrorHandler('대댓글 작성에 실패했습니다.')(error));
      }
    });
  }, [postId, user, createCommentMutation, createErrorHandler]);

  return {
    // 데이터 상태
    isOwner,
    
    // 비즈니스 로직 함수들
    updateComment,
    deleteComment,
    createReply,
    
    // 로딩 상태
    isCreating: createCommentMutation.isPending,
    isUpdating: updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending
  };
};