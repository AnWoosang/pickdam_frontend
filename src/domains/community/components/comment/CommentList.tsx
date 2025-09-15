'use client';

import { Comment } from '@/domains/community/types/community';
import { CommentCard } from '@/domains/community/components/comment/CommentCard';

import React from 'react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  postId: string;
  onUpdate: () => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  isLoading,
  postId,
  onUpdate
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {comments.length > 0 ? (
        <div className="px-4">
          {comments.map((comment, index) => (
            <div 
              key={comment.id} 
              className={`${index < comments.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <CommentCard 
                comment={comment}
                onUpdate={onUpdate}
                postId={postId}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          첫 번째 댓글을 작성해보세요!
        </div>
      )}
    </div>
  );
};