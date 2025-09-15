'use client';

import React from 'react';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { useAuthStore } from '@/domains/auth/store/authStore';

interface ReplyFormProps {
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  replyContent,
  setReplyContent,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const { user } = useAuthStore();
  return (
    <div className="ml-11 mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex gap-2">
        <Avatar
          src={user?.profileImageUrl}
          alt={`${user?.nickname || 'User'} 프로필 사진`}
          size="xsmall"
        />
        <div className="flex-1">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 작성하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={2}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="small"
              onClick={onCancel}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={onSubmit}
              disabled={!replyContent.trim() || isLoading}
            >
              등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};