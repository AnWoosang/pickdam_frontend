"use client";

import { useCreateCommentMutation } from '@/domains/community/hooks/comment/useCommentQueries';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { BusinessError } from '@/shared/error/BusinessError';
import { useAuthStore } from '@/domains/auth/store/authStore';

interface UseCommentFormProps {
  postId: string;
  onSuccess: () => void;
}

export const useCommentForm = ({ postId, onSuccess }: UseCommentFormProps) => {
  const { user } = useAuthStore();
  
  // 상태
  const [newComment, setNewComment] = useState('');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // React Query Mutation
  const createCommentMutation = useCreateCommentMutation();

  // 공통 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown) => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return error;
      return new BusinessError('COMMENT_CREATION_ERROR', defaultMessage);
    }, 
    []
  );

  // 댓글 작성 핸들러
  const handleCommentSubmit = useCallback(() => {
    if (!newComment.trim()) {
      toast.error('댓글을 입력해주세요.');
      return;
    }
    
    createCommentMutation.mutate({
      content: newComment.trim(),
      postId: postId,
      authorId: user!.id
    }, {
      onSuccess: () => {
        setNewComment('');
        toast.success('댓글이 등록되었습니다.');
        onSuccess(); // 댓글 목록 새로고침 및 첫 페이지로 이동
      },
      onError: (error) => {
        console.error('댓글 작성 실패:', error);
        const processedError = createErrorHandler('댓글 작성에 실패했습니다.')(error);
        toast.error(processedError.message);
      }
    });
  }, [newComment, user, postId, createCommentMutation, onSuccess, createErrorHandler]);

  // 제출 다이얼로그 핸들러
  const handleSubmitClick = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setShowSubmitDialog(true);
    }
  }, [newComment]);

  const handleConfirmSubmit = useCallback(() => {
    setShowSubmitDialog(false);
    handleCommentSubmit();
  }, [handleCommentSubmit]);

  const handleCloseSubmitDialog = useCallback(() => {
    setShowSubmitDialog(false);
  }, []);

  return {
    // 상태
    newComment,
    setNewComment,
    showSubmitDialog,
    
    // 핸들러
    handleSubmitClick,
    handleConfirmSubmit,
    handleCloseSubmitDialog,
    
    // 로딩 상태
    isCreating: createCommentMutation.isPending
  };
};