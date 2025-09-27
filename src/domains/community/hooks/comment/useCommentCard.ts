"use client";

import { useCallback, useMemo } from 'react';
import {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation
} from '@/domains/community/hooks/comment/useCommentQueries';
import { Comment } from '@/domains/community/types/community';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/domains/auth/store/authStore';

interface UseCommentCardProps {
  comment: Comment;
  postId: string;
  onUpdate: () => void;
}

export const useCommentCard = ({ comment, postId, onUpdate }: UseCommentCardProps) => {
  const { user } = useAuthUtils();
  const { showToast } = useUIStore();

  // React Query Mutations
  const createCommentMutation = useCreateCommentMutation();
  const createReplyMutation = useCreateReplyMutation();
  const updateCommentMutation = useUpdateCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const deleteReplyMutation = useDeleteReplyMutation();

  // 권한 확인
  const isOwner = useMemo(() => 
    user && (user.id === comment.authorId), 
    [user, comment.authorId]
  );



  const updateComment = useCallback((content: string) => {
    updateCommentMutation.mutate({
      commentId: comment.id,
      data: {
        content,
        postId: comment.postId,
        parentId: comment.parentId
      }
    }, {
      onSuccess: () => {
        showToast('댓글이 수정되었습니다.', 'success');
        onUpdate();
      },
      onError: () => {
        showToast('댓글 수정에 실패했습니다.', 'error');
      }
    });
  }, [comment.id, comment.postId, comment.parentId, updateCommentMutation, showToast, onUpdate]);

  const deleteComment = useCallback(() => {
    // 답글인지 댓글인지 구분해서 처리
    if (comment.parentId) {
      // 답글 삭제
      deleteReplyMutation.mutate({
        parentCommentId: comment.parentId,
        replyId: comment.id
      }, {
        onSuccess: () => {
          showToast('답글이 삭제되었습니다.', 'success');
          onUpdate();
        },
        onError: () => {
          showToast('답글 삭제에 실패했습니다.', 'error');
        }
      });
    } else {
      // 댓글 삭제 (모든 답글도 함께 삭제)
      deleteCommentMutation.mutate({
        commentId: comment.id
      }, {
        onSuccess: () => {
          showToast('댓글이 삭제되었습니다.', 'success');
          onUpdate();
        },
        onError: () => {
          showToast('댓글 삭제에 실패했습니다.', 'error');
        }
      });
    }
  }, [comment.id, comment.parentId, deleteCommentMutation, deleteReplyMutation, showToast, onUpdate]);

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
      parentId
    };

    createReplyMutation.mutate(requestData, {
      onSuccess: (newReply) => {
        onSuccess?.(newReply);
      },
      onError: (error) => {
        showToast('대댓글 작성에 실패했습니다.', 'error');
        onError?.(error as Error);
      }
    });
  }, [postId, createReplyMutation, showToast]);

  return {
    // 데이터 상태
    isOwner,
    
    // 비즈니스 로직 함수들
    updateComment,
    deleteComment,
    createReply,
    
    // 로딩 상태
    isCreating: createCommentMutation.isPending || createReplyMutation.isPending,
    isUpdating: updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending || deleteReplyMutation.isPending
  };
};