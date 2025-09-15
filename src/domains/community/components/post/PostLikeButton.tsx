'use client';

import { Post } from '@/domains/community/types/community';
import { usePostLikeButton } from '@/domains/community/hooks/usePostLikeButton';

import React from 'react';
import { Button } from '@/shared/components/Button';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { User } from '@/domains/user/types/user';

interface PostLikeButtonProps {
  post: Post;
  currentUser?: User | null;
}

export const PostLikeButton = React.memo(({
  post,
  currentUser
}: PostLikeButtonProps) => {
  const {
    isLiked,
    likeCount,
    isLoading,
    canLike,
    handleLikeToggle
  } = usePostLikeButton({ post, currentUser });

  return (
    <Button
      variant="ghost"
      onClick={handleLikeToggle}
      noFocus={true}
      disabled={!canLike || isLoading}
      className={`flex flex-col items-center justify-center gap-1 w-20 h-20 !rounded-full !bg-transparent border border-gray-300 hover:border-black hover:bg-gray-50 ${
        !canLike || isLoading ? 'cursor-not-allowed opacity-60' : ''
      } ${isLoading ? 'animate-pulse' : ''}`}
    >
      <span className="text-lg">
        {isLiked ? <IoHeart className="text-red-500" size={20} /> : <IoHeartOutline className="text-gray-500" size={20} />}
      </span>
      <div className="text-xs font-bold text-gray-600 leading-tight text-center">
        <div>좋아요</div>
        <div>{likeCount}</div>
      </div>
    </Button>
  );
});

PostLikeButton.displayName = 'PostLikeButton';