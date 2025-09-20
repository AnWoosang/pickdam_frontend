'use client';

import React from 'react';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/domains/auth/store/authStore';

interface CommentFormProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  newComment,
  setNewComment,
  onSubmit
}) => {
  const { user } = useAuthUtils();
  const { openLoginModal } = useUIStore();
  if (!user) {
    return (
      <div className="mb-6 text-center">
        <p className="text-gray-600 mb-3">댓글을 작성하려면 로그인이 필요합니다.</p>
        <Button
          variant="primary"
          size="medium"
          onClick={openLoginModal}
        >
          로그인하기
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mb-2">
      <div className="flex gap-3">
        <Avatar
          src={user?.profileImageUrl}
          alt={`${user?.nickname || 'User'} 프로필 사진`}
          size="small"
        />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={!newComment.trim()}
            >
              등록
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};