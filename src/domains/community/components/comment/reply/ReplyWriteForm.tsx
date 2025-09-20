'use client';

import { Comment } from '@/domains/community/types/community';

import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/domains/auth/store/authStore';

interface CommentReplyWriteProps {
  comment: Comment;
  onCreateReply: (params: {
    content: string;
    parentId: string;
    onSuccess?: (newReply: Comment) => void;
    onError?: (error: Error) => void;
  }) => void;
  onUpdate: () => void;
  rootCommentId?: string;
  isCreating: boolean;
}

export const CommentReplyWrite = React.memo(({
  comment,
  onCreateReply,
  onUpdate,
  rootCommentId,
  isCreating
}: CommentReplyWriteProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuthUtils();
  const { requireAuth } = useUIStore();

  const handleToggleReplyForm = useCallback(() => {
    if (!requireAuth()) return;
    
    if (!showReplyForm) {
      const mentionText = `@${comment.author.nickname} `;
      setReplyContent(mentionText);
      setShowReplyForm(true);
    } else {
      setShowReplyForm(false);
      setReplyContent('');
    }
  }, [showReplyForm, comment.author.nickname, requireAuth]);

  const handleReply = useCallback(() => {
    if (!replyContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    onCreateReply({
      content: replyContent.trim(),
      parentId: rootCommentId || comment.id,
      onSuccess: () => {
        setReplyContent('');
        setShowReplyForm(false);
        onUpdate();
      },
      onError: (error) => {
        console.error('대댓글 작성 실패:', error);
        alert('대댓글 작성에 실패했습니다.');
      }
    });
  }, [replyContent, onCreateReply, rootCommentId, comment.id, onUpdate]);

  const handleCancelReply = useCallback(() => {
    setShowReplyForm(false);
    setReplyContent('');
  }, []);

  return (
    <>
      {/* 답글 버튼 */}
      <div className="ml-11 mt-2">
        <Button 
          variant="ghost" 
          size="small" 
          onClick={handleToggleReplyForm}
        >
          답글
        </Button>
      </div>
      
      {/* 답글 작성 폼 */}
      {showReplyForm && user && (
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
                disabled={isCreating}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleCancelReply}
                  disabled={isCreating}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleReply}
                  disabled={!replyContent.trim() || isCreating}
                >
                  등록
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

CommentReplyWrite.displayName = 'CommentReplyWrite';