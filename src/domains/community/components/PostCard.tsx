'use client';

import { Post } from '@/domains/community/types/community';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Heart } from 'lucide-react';
import { PostCategoryBadge } from '@/domains/community/components/post/PostCategoryBadge';
import { Avatar } from '@/shared/components/Avatar';
import { formatDate } from '@/shared/utils/Format';
import { ROUTES } from '@/app/router/routes';
import { stripHtml } from 'string-strip-html';

interface PostCardProps {
  post: Post;
  showContent?: boolean;
  maxContentLength?: number;
}

export const PostCard = React.memo(({ 
  post, 
  showContent = true, 
  maxContentLength = 200 
}: PostCardProps) => {
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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 mr-2">
          {post.title}
        </h3>
        {post.category?.id && (
          <PostCategoryBadge
            categoryId={post.category.id}
          />
        )}
      </div>
      
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
          <div className="flex items-center gap-2">
            <Avatar
              src={post.profileImageUrl}
              alt={`${post.authorNickname} 프로필 사진`}
              size="xsmall"
            />
            <span>
              {getAuthorName(post.authorNickname)}
            </span>
          </div>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {getCountValue(post.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {getCountValue(post.likeCount)}
          </span>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';