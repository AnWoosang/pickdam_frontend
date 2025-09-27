'use client';

import React, { useState, useCallback } from 'react';
import { Comment } from '@/domains/community/types/community';
import { useCommentCard } from '@/domains/community/hooks/comment/useCommentCard';
import { CommentHeader } from '@/domains/community/components/comment/CommentHeader';
import { CommentContent } from '@/domains/community/components/comment/CommentContent';
import { CommentLikeButton } from '@/domains/community/components/comment/CommentLikeButton';
import { CommentReplyList } from '@/domains/community/components/comment/reply/CommentReplyList';
import { CommentReplyWrite } from '@/domains/community/components/comment/reply/ReplyWriteForm';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface CommentCardProps {
  comment: Comment;
  onUpdate: () => void;
  postId: string;
  isReply?: boolean;
  rootCommentId?: string; // 최상위 댓글 ID (대댓글에서 사용)
}

export const CommentCard = React.memo(({
  comment,
  onUpdate,
  postId,
  isReply = false,
  rootCommentId
}: CommentCardProps) => {
  // UI 상태들을 컴포넌트에서 직접 관리
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 비즈니스 로직만 훅에서 가져옴
  const {
    // 데이터 상태
    isOwner,
    
    // 비즈니스 로직 함수들
    updateComment,
    deleteComment,
    createReply,
    
    // 로딩 상태
    isCreating,
    isUpdating,
    isDeleting
  } = useCommentCard({ comment, postId, onUpdate});

  // UI 핸들러들
  const handleEdit = useCallback((content: string) => {
    updateComment(content);
  }, [updateComment]);

  const handleDelete = useCallback(() => {
    deleteComment();
    setShowDeleteDialog(false);
  }, [deleteComment]);



  const handleShowDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleEditingChange = useCallback((editing: boolean) => {
    setIsEditing(editing);
  }, []);

  return (
    <div className="py-4">
      <CommentHeader
        comment={comment}
        isOwner={!!isOwner}
        onEdit={handleEdit}
        onDelete={handleShowDeleteDialog}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onEditingChange={handleEditingChange}
      />

      {!isEditing && <CommentContent content={comment.content} />}
      
      <CommentLikeButton
        comment={comment}
      />

      <CommentReplyWrite
        comment={comment}
        onCreateReply={createReply}
        onUpdate={onUpdate}
        rootCommentId={rootCommentId}
        isCreating={isCreating}
      />

      <CommentReplyList
        comment={comment}
        postId={postId}
        isReply={isReply}
        onUpdate={onUpdate}
        CommentCard={CommentCard}
      />
      
      {/* 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDelete}
          message="댓글을 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
        />
      )}
    </div>
  );
});

CommentCard.displayName = 'CommentCard';