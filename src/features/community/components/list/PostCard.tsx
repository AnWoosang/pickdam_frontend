'use client';

import React from 'react';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/community';
import { Badge } from '@/components/common/Badge';

interface PostCardProps {
  post: Post;
  onPostClick: (postId: string) => void;
  formatDate: (dateString: string) => string;
}

export const PostCard = React.memo(({ post, onPostClick, formatDate }: PostCardProps) => {
  const truncateContent = (content: string) => {
    // 줄바꿈을 공백으로 치환하고 불필요한 공백 제거
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    
    // 200자로 제한
    const maxLength = 200;
    
    if (cleanContent.length > maxLength) {
      return cleanContent.substring(0, maxLength) + '...';
    }
    return cleanContent;
  };

  return (
    <div
      onClick={() => onPostClick(post.id)}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 transition-all hover:shadow-md cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
        {post.title}
      </h3>
      
      {post.content && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {truncateContent(post.content)}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          {post.category && (
            <Badge 
              variant="custom" 
              color={post.category.color}
              size="small"
            >
              {post.category.name}
            </Badge>
          )}
          <span>{post.author}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.viewCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likeCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.commentCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';