"use client";

import { useCreateCommentMutation } from '@/domains/community/hooks/comment/useCommentQueries';

import { useState, useCallback } from 'react';
import { useUIStore } from '@/domains/auth/store/authStore';

interface UseCommentFormProps {
  postId: string;
  onSuccess: () => void;
}

export const useCommentForm = ({ postId, onSuccess }: UseCommentFormProps) => {
  // 상태
  const [newComment, setNewComment] = useState('');
  const { showToast } = useUIStore();

  // React Query Mutation
  const createCommentMutation = useCreateCommentMutation();


  // 댓글 작성 핸들러
  const handleCommentSubmit = useCallback(() => {
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      content: newComment.trim(),
      postId: postId
    }, {
      onSuccess: () => {
        setNewComment('');
        showToast('댓글이 등록되었습니다.', 'success');
        onSuccess(); // 댓글 목록 새로고침 및 첫 페이지로 이동
      },
      onError: () => {
        showToast('댓글 작성에 실패했습니다.', 'error');
      }
    });
  }, [newComment, postId, createCommentMutation, onSuccess, showToast]);

  // 제출 핸들러
  const handleSubmitClick = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleCommentSubmit();
  }, [handleCommentSubmit]);

  return {
    // 상태
    newComment,
    setNewComment,

    // 핸들러
    handleSubmitClick,

    // 로딩 상태
    isCreating: createCommentMutation.isPending
  };
};