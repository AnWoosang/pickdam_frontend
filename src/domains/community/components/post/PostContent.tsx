'use client';

import { Post } from '@/domains/community/types/community';

import React from 'react';
import { Divider } from '@/shared/components/Divider';
import { PostLikeButton } from '@/domains/community/components/post/PostLikeButton';

interface PostContentProps {
  post: Post;
}

export const PostContent: React.FC<PostContentProps> = ({ 
  post
}) => {
  return (
    <div className="py-10">
      <div className="prose max-w-none">
        {post.content ? (
          <div 
            className="text-gray-700 leading-relaxed prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-gray-500 italic">내용이 없습니다.</p>
        )}
      </div>

      {/* 게시글 좋아요 버튼 */}
      <div className="flex items-center justify-center mt-6 mb-10">
        <PostLikeButton post={post} />
      </div>
      <Divider color="medium" spacing="none" />
    </div>
  );
};