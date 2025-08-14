'use client';

import React from 'react';
import { Post } from '@/types/community';
import { Button } from '@/components/common/Button';
import { Divider } from '@/components/common/Divider';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

interface PostContentProps {
  post: Post;
  isLiked: boolean;
  onLike: () => void;
  isEditing?: boolean;
  editedContent?: string;
  onContentChange?: (value: string) => void;
}

export const PostContent: React.FC<PostContentProps> = ({ 
  post, 
  isLiked, 
  onLike, 
  isEditing = false,
  editedContent = '',
  onContentChange
}) => {
  return (
    <div className="py-10">
      <div className="prose max-w-none">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => onContentChange?.(e.target.value)}
            className="w-full min-h-[200px] p-3 text-black leading-relaxed border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="내용을 입력하세요..."
          />
        ) : (
          <>
            {post.content ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">내용이 없습니다.</p>
            )}
          </>
        )}
      </div>

      {/* 게시글 액션 버튼 */}
      <div className="flex items-center justify-center mt-6 mb-10">
        <Button
          variant="ghost"
          onClick={onLike}
          noFocus={true}
          className="flex flex-col items-center justify-center gap-1 w-20 h-20 !rounded-full !bg-transparent border border-gray-300 hover:border-black hover:bg-gray-50"
        >
          <span className="text-lg">
            {isLiked ? <IoHeart className="text-red-500" size={20} /> : <IoHeartOutline className="text-gray-500" size={20} />}
          </span>
          <div className="text-xs font-bold text-gray-600 leading-tight text-center">
            <div>좋아요</div>
            <div>{(post.likeCount || 0) + (isLiked ? 1 : 0)}</div>
          </div>
        </Button>
      </div>
      <Divider color="medium" spacing="none" />
    </div>
  );
};