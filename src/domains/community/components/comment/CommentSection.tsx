'use client';

import React from 'react';
import { useCommentSection } from '@/domains/community/hooks/comment/useCommentSection';
import { useCommentForm } from '@/domains/community/hooks/comment/useCommentForm';
import { CommentForm } from '@/domains/community/components/comment/CommentForm';
import { CommentList } from '@/domains/community/components/comment/CommentList';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Pagination } from '@/shared/components/Pagination';
import { useAuthStore } from '@/domains/auth/store/authStore';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
}) => {
  const { user } = useAuthStore();
  const {
    currentPage,
    comments,
    totalComments,
    totalPages,
    isLoading,
    handlePageChange,
    handleCommentUpdate
  } = useCommentSection({ 
    postId, 
    currentUserId: user?.id  // ✅ currentUserId 전달
  });

  const {
    newComment,
    setNewComment,
    showSubmitDialog,
    handleSubmitClick,
    handleConfirmSubmit,
    handleCloseSubmitDialog
  } = useCommentForm({ 
    postId, 
    onSuccess: handleCommentUpdate 
  });
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        전체 댓글 {totalComments}개
      </h3>

      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmit={handleSubmitClick}
      />

      <CommentList
        comments={comments}
        isLoading={isLoading}
        postId={postId}
        onUpdate={handleCommentUpdate}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPageNumbers={5}
        />
      )}

      <ConfirmDialog
        isOpen={showSubmitDialog}
        onClose={handleCloseSubmitDialog}
        onConfirm={handleConfirmSubmit}
        message="댓글을 등록하시겠습니까?"
        confirmText="등록"
        cancelText="취소"
        confirmButtonColor="primary"
        icon="✅"
      />
    </div>
  );
};