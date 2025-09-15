'use client';

import { Comment } from '@/domains/community/types/community';
import { ReplyForm } from '@/domains/community/components/comment/reply/ReplyForm';

import React, { useState, useCallback } from 'react';
import { Button } from '@/shared/components/Button';
import { useAuthStore } from '@/domains/auth/store/authStore';

interface CommentReplyWriteProps {
  comment: Comment;
  onCreateReply: (params: {
    content: string;
    parentId: string;
    replyToCommentId: string;
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
  const { requireAuth, user } = useAuthStore();

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
      replyToCommentId: comment.id,
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
        <ReplyForm
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onSubmit={handleReply}
          onCancel={handleCancelReply}
          isLoading={isCreating}
        />
      )}
    </>
  );
});

CommentReplyWrite.displayName = 'CommentReplyWrite';