'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle } from 'lucide-react';
import { MyPost } from '@/domains/user/types/mypage';
import { PostCategoryBadge } from '@/domains/community/components/post/PostCategoryBadge';
import { formatDate } from '@/shared/utils/Format';
import { stripHtml } from 'string-strip-html';
import { ROUTES } from '@/app/router/routes';

interface MyPostCardProps {
  post: MyPost;
  showContent?: boolean;
  maxContentLength?: number;
}

export const MyPostCard = React.memo(({ 
  post, 
  showContent = true, 
  maxContentLength = 200 
}: MyPostCardProps) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(ROUTES.COMMUNITY.DETAIL(post.id));
  }, [router, post.id]);

  const getAuthorName = (author?: string): string => {
    return author || 'Unknown';
  };

  const getCountValue = (count?: number): number => {
    return count || 0;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 transition-all hover:shadow-md cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
        {post.title}
      </h3>
      
      {showContent && post.content && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {(() => {
            const textContent = stripHtml(post.content).result;
            const cleanContent = textContent.replace(/\s+/g, ' ').trim();
            return cleanContent.length > maxContentLength
              ? cleanContent.substring(0, maxContentLength) + '...'
              : cleanContent;
          })()}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          {post.categoryId && (
            <PostCategoryBadge 
              categoryId={post.categoryId}
            />
          )}
          <span>
            {getAuthorName(post.authorNickname)}
          </span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${post.isLiked ? 'text-red-500' : ''}`} />
            {getCountValue(post.likeCount)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {getCountValue(post.commentCount)}
          </span>
        </div>
      </div>
    </div>
  );
});

MyPostCard.displayName = 'MyPostCard';