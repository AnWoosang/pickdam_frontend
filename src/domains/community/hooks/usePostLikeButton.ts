"use client";

import { Post } from '@/domains/community/types/community';
import { useTogglePostLikeMutation } from '@/domains/community/hooks/usePostQueries';

import { useState, useCallback, useEffect } from 'react';
import { useUIStore } from '@/domains/auth/store/authStore';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';

interface UsePostLikeButtonProps {
  post: Post;
}

export const usePostLikeButton = ({ post }: UsePostLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const toggleLikeMutation = useTogglePostLikeMutation();
  const { showToast } = useUIStore();
  const { isAuthenticated } = useAuthUtils();

  // post 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    setIsLiked(post.isLiked ?? false);
    setLikeCount(post.likeCount || 0);
  }, [post.isLiked, post.likeCount]);

  const handleLikeToggle = useCallback(() => {
    // Optimistic UI 업데이트
    const wasLiked = isLiked;
    const oldLikeCount = likeCount;
    
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? oldLikeCount - 1 : oldLikeCount + 1);

    toggleLikeMutation.mutate({
      id: post.id,
    }, {
      onSuccess: (result) => {
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
      },
      onError: () => {
        // 실패 시 이전 상태로 롤백
        setIsLiked(wasLiked);
        setLikeCount(oldLikeCount);
        showToast('좋아요 처리에 실패했습니다.', 'error');
      }
    });
  }, [post.id, isLiked, likeCount, toggleLikeMutation, showToast]);

  return {
    // 상태
    isLiked,
    likeCount,
    isLoading: toggleLikeMutation.isPending,
    
    // 액션
    handleLikeToggle,
    
    // 권한
    canLike: isAuthenticated,
  };
};