'use client';

import React from 'react';
import { useCommentSection } from '@/domains/community/hooks/comment/useCommentSection';
import { useCommentForm } from '@/domains/community/hooks/comment/useCommentForm';
import { CommentForm } from '@/domains/community/components/comment/CommentForm';
import { CommentList } from '@/domains/community/components/comment/CommentList';
import { Pagination } from '@/shared/components/Pagination';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

interface CommentSectionProps {
  postId: string;
  postCommentCount?: number; // 게시글의 전체 댓글+답글 개수
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  postCommentCount,
}) => {
  const {
    currentPage,
    comments,
    totalComments,
    totalPages,
    isLoading,
    queryError,
    handlePageChange,
    handleCommentUpdate
  } = useCommentSection({
    postId,
    postCommentCount
  });

  const {
    newComment,
    setNewComment,
    handleSubmitClick
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

      {queryError ? (
        <ErrorMessage
          message="댓글을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
          onRetry={() => window.location.reload()}
        />
      ) : (
        <CommentList
          comments={comments}
          isLoading={isLoading}
          postId={postId}
          onUpdate={handleCommentUpdate}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPageNumbers={5}
        />
      )}

    </div>
  );
};