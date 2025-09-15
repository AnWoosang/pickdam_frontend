"use client";

import { Post } from '@/domains/community/types/community';
import { useTogglePostLikeMutation } from '@/domains/community/hooks/usePostQueries';

import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User } from '@/domains/user/types/user';
import { BusinessError, createBusinessError } from '@/shared/error/BusinessError';
import { useAuthStore } from '@/domains/auth/store/authStore';

interface UsePostLikeButtonProps {
  post: Post;
  currentUser?: User | null;
}

export const usePostLikeButton = ({ post, currentUser }: UsePostLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const toggleLikeMutation = useTogglePostLikeMutation();
  const { requireAuth } = useAuthStore();
  
  // 에러 핸들러
  const createErrorHandler = useCallback((defaultMessage: string) => 
    (error: unknown): BusinessError => {
      if (error instanceof BusinessError) return error;
      if (error instanceof Error) return createBusinessError.dataProcessing(defaultMessage, error.message);
      return createBusinessError.dataProcessing(defaultMessage);
    }, 
    []
  );

  // post 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    setIsLiked(post.isLiked ?? false);
    setLikeCount(post.likeCount || 0);
  }, [post.isLiked, post.likeCount]);

  const handleLikeToggle = useCallback(() => {
    if (!requireAuth()) return;

    // Optimistic UI 업데이트
    const wasLiked = isLiked;
    const oldLikeCount = likeCount;
    
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? oldLikeCount - 1 : oldLikeCount + 1);

    toggleLikeMutation.mutate({
      id: post.id,
      memberId: currentUser!.id
    }, {
      onSuccess: (result) => {
        setIsLiked(result.isLiked);
        setLikeCount(result.newLikeCount);
      },
      onError: (error) => {
        // 실패 시 이전 상태로 롤백
        setIsLiked(wasLiked);
        setLikeCount(oldLikeCount);
        const processedError = createErrorHandler('좋아요 처리에 실패했습니다.')(error);
        console.error('Post like toggle failed:', processedError);
        toast.error(processedError.message);
      }
    });
  }, [post.id, currentUser, isLiked, likeCount, toggleLikeMutation, createErrorHandler, requireAuth]);

  return {
    // 상태
    isLiked,
    likeCount,
    isLoading: toggleLikeMutation.isPending,
    
    // 액션
    handleLikeToggle,
    
    // 권한
    canLike: !!currentUser,
  };
};