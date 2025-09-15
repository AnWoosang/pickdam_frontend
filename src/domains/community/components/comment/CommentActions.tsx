'use client';

import { Comment } from '@/domains/community/types/community';
import { useToggleCommentLikeMutation } from '@/domains/community/hooks/comment/useCommentQueries';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components/Button';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useAuthStore } from '@/domains/auth/store/authStore';

interface CommentActionsProps {
  comment: Comment;
}

export const CommentActions = React.memo(({
  comment
}: CommentActionsProps) => {
  // 좋아요 상태를 내부에서 관리
  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const toggleLikeMutation = useToggleCommentLikeMutation();
  const { requireAuth, user } = useAuthStore();

  // 댓글 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    setIsLiked(comment.isLiked ?? false);
    setLikeCount(comment.likeCount || 0);
  }, [comment.isLiked, comment.likeCount]);

  const handleLikeToggle = useCallback(() => {
    if (!requireAuth()) return;

    const wasLiked = isLiked;
    const oldLikeCount = likeCount;
    
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? oldLikeCount - 1 : oldLikeCount + 1);

    toggleLikeMutation.mutate({
      commentId: comment.id,
      memberId: user!.id
    }, {
      onSuccess: (result) => {
        setIsLiked(result.isLiked);
        setLikeCount(result.newLikeCount);
      },
      onError: (error) => {
        setIsLiked(wasLiked);
        setLikeCount(oldLikeCount);
        alert(error instanceof Error ? error.message : '좋아요 처리에 실패했습니다.');
      }
    });
  }, [comment.id, user, isLiked, likeCount, toggleLikeMutation, requireAuth]);
  return (
    <div className="flex items-center gap-4 ml-11">
      <Button 
        variant="ghost" 
        size="small"
        onClick={handleLikeToggle}
        disabled={toggleLikeMutation.isPending}
        className={`transition-colors ${
          isLiked 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-500 hover:text-red-500'
        }`}
        icon={isLiked ? <IoHeart size={16} /> : <IoHeartOutline size={16} />}
      >
        {likeCount}
      </Button>
    </div>
  );
});

CommentActions.displayName = 'CommentActions';