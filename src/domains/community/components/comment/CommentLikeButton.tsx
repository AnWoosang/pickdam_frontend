'use client';

import { Comment } from '@/domains/community/types/community';
import { useToggleCommentLikeMutation } from '@/domains/community/hooks/comment/useCommentQueries';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/components/Button';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useUIStore } from '@/domains/auth/store/authStore';

interface CommentLikeButtonProps {
  comment: Comment;
}

export const CommentLikeButton = React.memo(({
  comment
}: CommentLikeButtonProps) => {
  // 좋아요 상태를 내부에서 관리
  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const toggleLikeMutation = useToggleCommentLikeMutation();
  const { showToast } = useUIStore();

  // 댓글 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    setIsLiked(comment.isLiked ?? false);
    setLikeCount(comment.likeCount || 0);
  }, [comment.isLiked, comment.likeCount]);

  const handleLikeToggle = useCallback(() => {
    const wasLiked = isLiked;
    const oldLikeCount = likeCount;
    
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? oldLikeCount - 1 : oldLikeCount + 1);

    toggleLikeMutation.mutate({
      commentId: comment.id
    }, {
      onSuccess: (result) => {
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
        showToast('좋아요에 성공했습니다.', 'success');
      },
      onError: () => {
        setIsLiked(wasLiked);
        setLikeCount(oldLikeCount);
        showToast('좋아요에 실패했습니다.', 'error');
      }
    });
  }, [comment.id, isLiked, likeCount, toggleLikeMutation, showToast]);
  
  return (
    <div className="flex items-center gap-4 ml-11">
      <Button
        variant="ghost"
        size="small"
        onClick={handleLikeToggle}
        disabled={toggleLikeMutation.isPending}
        className={`transition-colors gap-1 ${
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

CommentLikeButton.displayName = 'CommentActions';